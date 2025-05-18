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
  #species = new Map()
  #connections = new Map()
  #pixelsPerMeter = 0 // Will store our calculated ratio
  #gridWidth = 0
  #gridHeight = 0
  #marginX = 0
  #marginY = 0
  #menuNode = null
  #currentSpecies = null

  #rowPositions = []

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
    this.#setupContextMenu();
    this.#centerScroll();
  }

  disconnect() {
    if (this.#menuNode) {
      document.body.removeChild(this.#menuNode);
    }
  }

  addSpecies(event) {
    // <Int, [Species]>
    const treeRowMap = new Map();
    for (const index in this.#rowPositions) {
      treeRowMap.set(parseInt(index), []);
    }

    for (const species of this.#species.values()) {
      const y = species.circlePosition.y;
      const rowNumber = this.#rowPositions.indexOf(y);

      if (rowNumber === -1) {
        continue;
      } else {
        treeRowMap.get(rowNumber).push(species);
      }
    }

    // Position of the row that will be used to get the y from the row list.
    var rowPosition = 0;
    // Initial x position respecting the margins;
    var xPosition = this.#marginX;
    // Last x position respecting the margins;
    const lastXPosition = this.#marginX + (this.widthValue * this.#pixelsPerMeter);

    let fallback = false;
    // For each line
    while (rowPosition < this.#rowPositions.length) {
      const occupiedXPositions = treeRowMap.get(rowPosition).map(species => species.circlePosition.x);
      // Reset xPosition for the new row
      xPosition = this.#marginX;

      // For each x in line
      while (xPosition <= lastXPosition) {
        if (occupiedXPositions.includes(xPosition)) {
          xPosition += 16;
        } else {
          // Is there any that overlaps?
            // No? Set in this position;
            // Yes? Can I place it here?
              // Yes? Place!
              // No? Find where I can place it
          break;
        }
      }

      if (xPosition < lastXPosition) {
        break;
      } else {
        rowPosition += 1;
      }
    }

    // If all rows are full, set fallback flag.
    if (rowPosition >= this.#rowPositions.length && xPosition > lastXPosition) {
      fallback = true;
    }

    const params = event.params
    const species = new Species({
      x: fallback ? 100 : xPosition, // Center horizontally
      y: fallback ? 100 : this.#rowPositions[rowPosition], // Place on first tree row
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
    const marginX = (containerWidth - gridWidth + 100) / 2
    const marginY = (containerHeight - gridHeight + 100) / 2

    this.#stage = new Konva.Stage({
      container: this.canvasContainerTarget,
      width: containerWidth + 100,
      height: containerHeight + 100,
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
      this.#rowPositions.push(yPosition);
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
    this.#stage.on("contextmenu", this.#handleContextMenu);
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
            strokeWidth: Math.min(
              this.#species.get(targetSpecies._id).radius,
              this.#species.get(otherSpecies._id).radius
            ) * 2,
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

    const targetRect = targetSpecies.circlePosition;
    const otherRect = otherSpecies.circlePosition;

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

  #setupContextMenu() {
    // Create menu container
    this.#menuNode = document.createElement('div');
    this.#menuNode.id = 'species-context-menu';
    this.#menuNode.style.display = 'none';
    this.#menuNode.style.position = 'absolute';
    this.#menuNode.style.width = '120px';
    this.#menuNode.style.backgroundColor = 'white';
    this.#menuNode.style.boxShadow = '0 0 5px grey';
    this.#menuNode.style.borderRadius = '3px';
    this.#menuNode.style.zIndex = '1000';

    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Remover';
    deleteButton.style.width = '100%';
    deleteButton.style.backgroundColor = 'white';
    deleteButton.style.border = 'none';
    deleteButton.style.margin = '0';
    deleteButton.style.padding = '10px';
    deleteButton.style.cursor = 'pointer';
    deleteButton.style.textAlign = 'left';
    deleteButton.style.color = '#dc3545'; // Bootstrap's danger red color

    // Add hover effects
    deleteButton.addEventListener('mouseover', () => {
      deleteButton.style.backgroundColor = '#f8f9fa';
    });
    deleteButton.addEventListener('mouseout', () => {
      deleteButton.style.backgroundColor = 'white';
    });

    // Add click handler
    deleteButton.addEventListener('click', () => {
      if (this.#currentSpecies) {
        // Remove all connections for this species
        this.#layer.find(".speciesRepresentation").forEach((otherSpecies) => {
          if (otherSpecies === this.#currentSpecies) return;
          const key = this.#connectionKey(this.#currentSpecies, otherSpecies);
          const existingLine = this.#connections.get(key);
          if (existingLine) {
            existingLine.destroy();
            this.#connections.delete(key);
          }
        });

        // Remove the species
        this.#species.delete(this.#currentSpecies._id);
        this.#currentSpecies.destroy();
        this.#layer.batchDraw();
      }
      this.#menuNode.style.display = 'none';
    });

    // Add button to menu
    this.#menuNode.appendChild(deleteButton);
    document.body.appendChild(this.#menuNode);

    // Hide menu on document click
    window.addEventListener('click', () => {
      this.#menuNode.style.display = 'none';
    });
  }

  #handleContextMenu = (e) => {
    // prevent default behavior
    e.evt.preventDefault();
    
    // if we clicked on empty space, do nothing
    if (e.target === this.#stage) {
      return;
    }

    // Check if we clicked on a species or its parent group
    const target = e.target;
    const isSpecies = target.hasName('speciesRepresentation') || 
                     (target.getParent() && target.getParent().hasName('speciesRepresentation'));

    if (isSpecies) {
      this.#currentSpecies = target.hasName('speciesRepresentation') ? target : target.getParent();
      
      // show menu
      this.#menuNode.style.display = 'initial';
      const containerRect = this.#stage.container().getBoundingClientRect();
      const pointerPos = this.#stage.getPointerPosition();
      
      this.#menuNode.style.top = 
        containerRect.top + pointerPos.y + 4 + 'px';
      this.#menuNode.style.left = 
        containerRect.left + pointerPos.x + 4 + 'px';
    }
  }

  /**
   * Exports the current canvas state as a PNG image.
   */
  saveAsImage() {
    // Create a white background rectangle
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.#stage.width(),
      height: this.#stage.height(),
      fill: 'white',
      listening: false
    });

    // Add the background to the layer
    this.#layer.add(background);
    background.moveToBottom(); // Ensure it's behind all other elements

    // Get the data URL of the stage
    const dataURL = this.#stage.toDataURL({ 
      pixelRatio: 2, // Higher quality
      mimeType: 'image/png'
    });

    // Remove the background
    background.destroy();
    this.#layer.batchDraw();

    // Create a temporary link element
    const link = document.createElement('a');
    link.download = 'agroforestry-design.png';
    link.href = dataURL;

    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Centers the scroll position of the canvas container to show the main grid area.
   * @private
   */
  #centerScroll() {
    const container = this.canvasContainerTarget;
    const scrollX = (container.scrollWidth - container.clientWidth) / 2;
    const scrollY = (container.scrollHeight - container.clientHeight) / 2;
    
    container.scrollTo({
      left: scrollX,
      top: scrollY
    });
  }
}
