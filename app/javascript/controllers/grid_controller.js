import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "cell",
    "canvasContainer"
  ]

  #stage
  #layer
  #species = new Map()
  #connections = new Map()
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
    var group1 = this.#createSpeciesRepresentation(10, 250, "green")
    var group2 = this.#createSpeciesRepresentation(600, 250,"pink")
    this.#layer.add(group1)
    this.#layer.add(group2)
    this.#species.set(group1._id, {spacing: 5 * this.#METERINPIXELS, representableShape: group1})
    this.#species.set(group2._id, {spacing: 10 * this.#METERINPIXELS, representableShape: group2})

    // Observe intersection on drag move
    this.#layer.on("dragmove", (e) => {
      const targetSpecies = e.target;

      this.#layer.find(".speciesRepresentation").forEach((otherSpecies) => {
        if (otherSpecies === targetSpecies) {
          return
        }

        const key = this.#connectionKey(targetSpecies, otherSpecies)
        const existingLine = this.#connections.get(key)

        if (this.#haveIntersection(this.#species.get(targetSpecies._id), this.#species.get(otherSpecies._id))) {
          if (!existingLine) {
            // Create a new line if not existing
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
            // Update the existing line's points
            existingLine.points([
              targetSpecies.getAbsolutePosition().x,
              targetSpecies.getAbsolutePosition().y,
              otherSpecies.getAbsolutePosition().x,
              otherSpecies.getAbsolutePosition().y
            ])
          }
        } else {
          if (existingLine) {
            existingLine.destroy()
            this.#connections.delete(key)
          }
        }

      })

      this.#layer.batchDraw();  // better for performance
    });
  }

  #connectionKey(a, b) {
    const idA = a._id;
    const idB = b._id;
    return idA < idB ? `${idA}-${idB}` : `${idB}-${idA}`;
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

  #createSpeciesRepresentation(x, y, color) {
    var speciesRepresentation = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      name: "speciesRepresentation",
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
