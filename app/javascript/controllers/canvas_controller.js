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
    width: Number,
    height: Number
  }

  // Private Fields

  /** @type {Konva.Stage} The main canvas stage. */
  #stage

  /** @type {Konva.Layer} The Konva layer on which nodes and lines are drawn. */
  #layer

  /** @type {Map<string, Species>} Map of species ID to Species instances. */
  #species = new Map()

  /** @type {Map<string, Konva.Line>} Map of connection keys to their corresponding Konva line. */
  #connections = new Map()

  // Constants

  /** @type {number} Width of the canvas stage in pixels. */
  #STAGE_WIDTH = 1000

  /** @type {number} Height of the canvas stage in pixels. */
  #STAGE_HEIGHT = 500

  /** @type {number} Width of the planting site in meters. */
  #SITE_WIDTH = 20

  /** @type {number} Vertical tolerance in pixels for species overlap detection. */
  #Y_TOLERANCE = 10

  /** @type {number} Pixel-to-meter conversion factor. */
  #METER_IN_PIXELS = this.#STAGE_WIDTH / this.#SITE_WIDTH

  /**
   * Stimulus connect lifecycle method. Sets up the canvas stage and layer.
   */
  connect()  {
    this.#setupStage();
    this.#setupLayer();
    // this.#setupTreeRow()
    // this.#addEventListeners();
  }

  addSpecies(event) {
    const params = event.params
    const species = new Species({
      x: 10,
      y: 10,
      name: params.name,
      layer: params.layer,
      spacing: params.spacing * this.#METER_IN_PIXELS,
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
    this.#STAGE_WIDTH = containerRect.width
    this.#STAGE_HEIGHT = containerRect.height

    // Stage's size is matching the div container's size on initialization.
    // It is NOT, for now, listening to resize.
    this.#stage = new Konva.Stage({
      container: this.canvasContainerTarget,
      width: this.#STAGE_WIDTH,
      height: this.#STAGE_HEIGHT,
    });
  }

  /**
   * Initializes the Konva drawing layer.
   * @private
   */
  #setupLayer() {
    this.#layer = new Konva.Layer();
    this.#stage.add(this.#layer);

    // Horizontal lines
    const gridSizeY = this.#STAGE_HEIGHT / this.heightValue;
    for (let i = 0; i <= this.#STAGE_HEIGHT; i += gridSizeY) {
      const line = new Konva.Line({
        points: [0, i, this.#STAGE_WIDTH, i],
        stroke: "#e0e0e0",
        strokeWidth: 1
      });
      this.#layer.add(line);
    }

    // Vertical lines
    const gridSizeX = this.#STAGE_WIDTH / this.widthValue;
    for (let i = 0; i <= this.#STAGE_WIDTH; i += gridSizeX) {
      const line = new Konva.Line({
        points: [i, 0, i, this.#STAGE_HEIGHT],
        stroke: "#e0e0e0",
        strokeWidth: 1
      });
      this.#layer.add(line);
    }
  }

  #setupTreeRow() {
    const treeRow = new TreeRow({
      originX: 0,
      originY: 250,
      endX: this.#STAGE_WIDTH,
      endY: 250
    })
    this.#layer.add(treeRow.shapeRepresentation)
  }

  /**
   * Adds Konva event listeners to the layer.
   * @private
   */
  #addEventListeners = () => {
    this.#layer.on("dragmove", this.#handleDragMove);
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
          line.moveToBottom();
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
