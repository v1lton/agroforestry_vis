import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "cell",
    "canvasContainer"
  ]

  #stage
  #layer
  #species
  #STAGEWIDTH = 1000
  #STAGEHEIGHT = 500
  #SITEWIDTH = 20
  #METERINPIXELS = this.#STAGEWIDTH / this.#SITEWIDTH

  connect() {
    this.#setupStage()
    this.#setupLayer()
    this.#drawCanvas()
  }

  #drawCanvas() {
    // Const values
    const mangoSiteSpacing = 5

    // Create and add line
    var line = new Konva.Line({
      points: [0, 250, 1000, 250],
      stroke: "black",
      strokeWidth: 4,
      id: "line"
    })
    this.#layer.add(line)

    // Create species
    var group1 = this.#createSpeciesRepresentation(10, 250, "manga1", "green")
    var group2 = this.#createSpeciesRepresentation(600, 250, "manga2", "pink")
    this.#layer.add(group1)
    this.#layer.add(group2)
    this.#species = {
      manga1: {
        spacing: 5 * this.#METERINPIXELS,
        representableShape: group1
      },
      manga2: {
        spacing: 5 * this.#METERINPIXELS,
        representableShape: group2
      }
    }

    // Observe intersection on drag move
    this.#layer.on("dragmove", (e) => {
      const targetSpecies = e.target;

      // Remove old connector lines
      this.#layer.find('.connectorLine').forEach(line => line.destroy());

      this.#layer.children.forEach((otherSpecies) => {
        if (otherSpecies === targetSpecies || otherSpecies.id() === "line") {
          return;
        }

        if (this.#haveIntersection(this.#species[targetSpecies.id()], this.#species[otherSpecies.id()])) {
          const line = new Konva.Line({
            points: [
              targetSpecies.getAbsolutePosition().x,
              targetSpecies.getAbsolutePosition().y,
              otherSpecies.getAbsolutePosition().x,
              otherSpecies.getAbsolutePosition().y
            ],
            stroke: 'red',
            strokeWidth: 20,
            opacity: 0.3,
            name: 'connectorLine',  // important so we can easily remove it next dragmove
            listening: false        // line won't block any mouse events
          });
          this.#layer.add(line);
          line.moveToBottom()
        }
      });

      this.#layer.batchDraw();  // better for performance
    });
  }

  #setupLayer() {
    this.#layer = new Konva.Layer()
    this.#stage.add(this.#layer)
  }

  #setupStage() {
    this.#stage = new Konva.Stage({
      container: this.canvasContainerTarget,
      width: this.#STAGEWIDTH,
      height: this.#STAGEHEIGHT
    });
  }

  #haveIntersection(r1, r2) {
    if (Math.abs(r2.representableShape.getClientRect().y - r1.representableShape.getClientRect().y) > 10) {
      return false
    }

    const distanceAB = Math.abs(r2.representableShape.getClientRect().x - r1.representableShape.getClientRect().x)

    return distanceAB < Math.max(r1.spacing, r2.spacing)
  }

  #createSpeciesRepresentation(x, y, id, color) {
    var speciesRepresentation = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      id: id
    })

    var circle = new Konva.Circle({
      radius: 10,
      fill: color,
      name: 'fillShape',
    })

    speciesRepresentation.add(circle)

    return speciesRepresentation
  }
}
