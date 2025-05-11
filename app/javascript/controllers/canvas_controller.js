import { Controller } from "@hotwired/stimulus"
import { Species } from "../models/species"
import { TreeRow } from "../models/tree_row"

/**
 * CanvasController manages the agroforestry canvas, handling species rendering and interactions.
 * It tracks species positions, manages production overlap connections, and redraws when needed.
 */
export default class extends Controller {
  static targets = ["cell", "canvasContainer"]

  static values = {
    width: Number,  // width in meters
    height: Number, // height in meters
    rowSpacing: { type: Number },
  }

  // Private Fields
  #stage
  #layer
  #rulerLayer
  #species = new Map()
  #connections = new Map()
  #pixelsPerMeter = 0 // Will store our calculated ratio
  #gridWidth = 0
  #gridHeight = 0
  #marginX = 0
  #marginY = 0

  // Constants

  /** @type {number} Vertical tolerance in pixels for species overlap detection. */
  #Y_TOLERANCE = 10

  /**
   * Stimulus connect lifecycle method. Sets up the canvas stage and layer.
   */
  connect()  {
    this.#setupStage();
    this.#setupLayer();
    this.#setupTreeRows()
    this.#addEventListeners();
  }

  addSpecies(event) {
    const params = event.params
    const species = new Species({
      x: this.#marginX + (this.#gridWidth / 2), // Center horizontally
      y: this.#marginY + this.#pixelsPerMeter, // Place on first tree row
      name: params.name,
      layer: params.layer,
      spacing: params.spacing * this.#pixelsPerMeter,
      start_crop: params.start,
      end_crop: params.end
    })

    this.#layer.add(species.shapeRepresentation)
    this.#species.set(species.id, species)
  }

  /**
   * Initializes the Konva stage.
   * @private
   */
  #setupStage() {
    const containerRect = this.canvasContainerTarget.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    // Calculate the maximum available space for the grid
    const maxGridWidth = containerWidth * 0.95  // 95% of container width
    const maxGridHeight = containerHeight * 0.95 // 95% of container height

    // Calculate pixels per meter for both dimensions
    const widthRatio = maxGridWidth / this.widthValue
    const heightRatio = maxGridHeight / this.heightValue

    // Use the smaller ratio to ensure the grid fits in both dimensions
    this.#pixelsPerMeter = Math.min(widthRatio, heightRatio)

    // Calculate actual grid dimensions in pixels
    const gridWidth = this.widthValue * this.#pixelsPerMeter
    const gridHeight = this.heightValue * this.#pixelsPerMeter

    // Calculate margins to center the grid
    const marginX = (containerWidth - gridWidth) / 2
    const marginY = (containerHeight - gridHeight) / 2

    this.#stage = new Konva.Stage({
      container: this.canvasContainerTarget,
      width: containerWidth,
      height: containerHeight,
    });

    // Store grid dimensions and margins for use in other methods
    this.#gridWidth = gridWidth
    this.#gridHeight = gridHeight
    this.#marginX = marginX
    this.#marginY = marginY
  }

  /**
   * Initializes the Konva drawing layer.
   * @private
   */
  #setupLayer() {
    this.#layer = new Konva.Layer();
    this.#stage.add(this.#layer);

    // Draw grid using the calculated dimensions
    // Horizontal lines
    for (let i = 0; i <= this.heightValue; i++) {
      const y = this.#marginY + (i * this.#pixelsPerMeter);
      const line = new Konva.Line({
        points: [this.#marginX, y, this.#marginX + this.#gridWidth, y],
        stroke: "#e0e0e0",
        strokeWidth: 1
      });
      this.#layer.add(line);
    }

    // Vertical lines
    for (let i = 0; i <= this.widthValue; i++) {
      const x = this.#marginX + (i * this.#pixelsPerMeter);
      const line = new Konva.Line({
        points: [x, this.#marginY, x, this.#marginY + this.#gridHeight],
        stroke: "#e0e0e0",
        strokeWidth: 1
      });
      this.#layer.add(line);
    }

    // Add meter labels
    this.#addMeterLabels();
  }

  #addMeterLabels() {
    // Add horizontal (width) labels
    for (let i = 0; i <= this.widthValue; i++) {
      const x = this.#marginX + (i * this.#pixelsPerMeter);
      const text = new Konva.Text({
        x: x - 10,
        y: this.#marginY + this.#gridHeight + 5,
        text: `${i}m`,
        fontSize: 12,
        fill: '#666'
      });
      this.#layer.add(text);
    }

    // Add vertical (height) labels
    for (let i = 0; i <= this.heightValue; i++) {
      const y = this.#marginY + (i * this.#pixelsPerMeter);
      const text = new Konva.Text({
        x: this.#marginX - 25,
        y: y - 6,
        text: `${i}m`,
        fontSize: 12,
        fill: '#666'
      });
      this.#layer.add(text);
    }
  }

  #setupTreeRows() {
    // Calculate tree row positions using the uniform scale
    for (let i = 1; i <= this.heightValue; i += this.rowSpacingValue) {
      const yPosition = this.#marginY + (i * this.#pixelsPerMeter)
      const treeRow = new TreeRow({
        originX: this.#marginX,
        originY: yPosition,
        endX: this.#marginX + this.#gridWidth,
        endY: yPosition
      });
      this.#layer.add(treeRow.shapeRepresentation);
    }
  }

  /**
   * Adds Konva event listeners to the layer.
   * @private
   */
  #addEventListeners = () => {
    this.#layer.on("dragmove", this.#handleDragMove);
    this.#layer.on("dragend", this.#handleDragEnd);
  }

  /**
   * Handles dragmove events on species nodes, updating or removing overlap connectors.
   * @param {Object} e - Konva event object.
   * @private
   */
  #handleDragMove = (e) => {
    const targetSpecies = e.target;

    this.#layer.find(".speciesRepresentation").forEach((otherSpecies) => {
      if (otherSpecies === targetSpecies) return;

      const key = this.#connectionKey(targetSpecies, otherSpecies);
      const existingLine = this.#connections.get(key);

      if (this.#haveIntersection(this.#species.get(targetSpecies._id), this.#species.get(otherSpecies._id))) {
        if (!existingLine) {
          const line = new Konva.Line({
            points: [
              targetSpecies.getAbsolutePosition().x,
              targetSpecies.getAbsolutePosition().y,
              otherSpecies.getAbsolutePosition().x,
              otherSpecies.getAbsolutePosition().y
            ],
            stroke: 'red',
            strokeWidth: 20,
            opacity: 0.5,
            name: 'connectorLine',
            listening: false
          });
          this.#layer.add(line);
          // Bring all species to the top to keep them in front of line
          this.#layer.find(".speciesRepresentation").forEach(species => species.moveToTop());
          this.#connections.set(key, line);
        } else {
          existingLine.points([
            targetSpecies.getAbsolutePosition().x,
            targetSpecies.getAbsolutePosition().y,
            otherSpecies.getAbsolutePosition().x,
            otherSpecies.getAbsolutePosition().y
          ]);
        }
      } else if (existingLine) {
        existingLine.destroy();
        this.#connections.delete(key);
      }
    });

    this.#layer.batchDraw();
  }

  /**
   * Handles dragend events, snapping species to the nearest tree row.
   * @param {Object} e - Konva event object.
   * @private
   */
  #handleDragEnd = (e) => {
    const targetSpecies = e.target;
    const currentY = targetSpecies.y();
    
    // Calculate all possible tree row positions
    const treeRowPositions = [];
    for (let i = 1; i <= this.heightValue; i += this.rowSpacingValue) {
      treeRowPositions.push(this.#marginY + (i * this.#pixelsPerMeter));
    }

    // Find the nearest tree row position
    const nearestRowY = treeRowPositions.reduce((nearest, current) => {
      return Math.abs(current - currentY) < Math.abs(nearest - currentY) ? current : nearest;
    });

    // Snap to the nearest row
    targetSpecies.y(nearestRowY);

    // Ensure x position stays within grid bounds
    const x = Math.max(this.#marginX, Math.min(targetSpecies.x(), this.#marginX + this.#gridWidth));
    targetSpecies.x(x);

    // Update all connections for this species
    this.#layer.find(".speciesRepresentation").forEach((otherSpecies) => {
      if (otherSpecies === targetSpecies) return;

      const key = this.#connectionKey(targetSpecies, otherSpecies);
      const existingLine = this.#connections.get(key);

      if (existingLine) {
        existingLine.points([
          targetSpecies.getAbsolutePosition().x,
          targetSpecies.getAbsolutePosition().y,
          otherSpecies.getAbsolutePosition().x,
          otherSpecies.getAbsolutePosition().y
        ]);
      }
    });

    this.#layer.batchDraw();
  }

  /**
   * Creates a consistent key to identify connections between two species nodes.
   * @param {Object} a - First Konva node.
   * @param {Object} b - Second Konva node.
   * @returns {string} A string key unique to the pair of nodes.
   * @private
   */
  #connectionKey = (a, b) => {
    const [idA, idB] = [a._id, b._id];
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
  }

  /**
   * Determines whether two species intersect based on layer, production overlap, and proximity.
   * @param {Species} targetSpecies - The first species.
   * @param {Species} otherSpecies - The second species.
   * @returns {boolean} True if they intersect, false otherwise.
   * @private
   */
  #haveIntersection(targetSpecies, otherSpecies) {
    if (targetSpecies.layer !== otherSpecies.layer) return false;
    if (!this.#hasProductionOverlap(targetSpecies, otherSpecies)) return false;

    const targetRect = targetSpecies.clientRect;
    const otherRect = otherSpecies.clientRect;

    const verticalDistance = Math.abs(otherRect.y - targetRect.y);
    if (verticalDistance > this.#Y_TOLERANCE) return false;

    const horizontalDistance = Math.abs(otherRect.x - targetRect.x);
    const maxSpacing = Math.max(targetSpecies.spacing, otherSpecies.spacing);
    return horizontalDistance < maxSpacing;
  }

  /**
   * Checks whether two species have overlapping production periods.
   * @param {Species} speciesA - First species.
   * @param {Species} speciesB - Second species.
   * @returns {boolean} True if they overlap in production time.
   * @private
   */
  #hasProductionOverlap(speciesA, speciesB) {
    return speciesA.start_crop < speciesB.end_crop && speciesB.start_crop < speciesA.end_crop;
  }
}
