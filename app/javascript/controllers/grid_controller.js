import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["cell", "canvasContainer"]

  // Private Fields
  #stage
  #layer
  #species = new Map()
  #connections = new Map()

  // Constants
  #STAGE_WIDTH = 1000
  #STAGE_HEIGHT = 500
  #SITE_WIDTH = 20
  #Y_TOLERANCE = 10
  #METER_IN_PIXELS = this.#STAGE_WIDTH / this.#SITE_WIDTH

  connect()  {
    this.#setupStage();
    this.#setupLayer();
    this.#drawCanvas();
    this.#addEventListeners();
  }

  // Setup Stage
  #setupStage() {
    this.#stage = new Konva.Stage({
      container: this.canvasContainerTarget,
      width: this.#STAGE_WIDTH,
      height: this.#STAGE_HEIGHT,
    });
  }

  // Setup Layer
  #setupLayer() {
    this.#layer = new Konva.Layer();
    this.#stage.add(this.#layer);
  }

  // Draw initial canvas
  #drawCanvas() {
    const mangoSiteSpacing = 5;

    const groundLine = new Konva.Line({
      points: [0, 250, this.#STAGE_WIDTH, 250],
      stroke: "black",
      strokeWidth: 4,
      id: "line"
    });
    this.#layer.add(groundLine);

    const species1 = this.#createSpeciesRepresentation(10, 250, "green");
    const species2 = this.#createSpeciesRepresentation(600, 250, "pink");

    this.#layer.add(species1, species2);

    this.#species.set(species1._id, { spacing: mangoSiteSpacing * this.#METER_IN_PIXELS, representableShape: species1 });
    this.#species.set(species2._id, { spacing: 10 * this.#METER_IN_PIXELS, representableShape: species2 });
  }

  // Create a draggable species
  #createSpeciesRepresentation(x, y, color) {
    const group = new Konva.Group({
      x,
      y,
      draggable: true,
      name: "speciesRepresentation",
    });

    group.add(new Konva.Circle({
      radius: 10,
      fill: color,
      name: 'fillShape',
    }));

    return group;
  }

  // Add event listeners
  #addEventListeners = () => {
    this.#layer.on("dragmove", this.#handleDragMove);
  }

  // Handle dragmove event
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

  // Calculate a stable connection key between two species
  #connectionKey = (a, b) => {
    const [idA, idB] = [a._id, b._id];
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
  }

  // Determine if two species intersect
  #haveIntersection = (speciesA, speciesB) => {
    const rectA = speciesA.representableShape.getClientRect();
    const rectB = speciesB.representableShape.getClientRect();

    if (Math.abs(rectB.y - rectA.y) > this.#Y_TOLERANCE) {
      return false;
    }

    const distanceX = Math.abs(rectB.x - rectA.x);
    return distanceX < Math.max(speciesA.spacing, speciesB.spacing);
  }
}
