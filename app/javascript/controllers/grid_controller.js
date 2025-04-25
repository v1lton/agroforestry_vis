import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "cell",
    "canvasContainer"
  ]

  #stage
  #layer
  #STAGEWIDTH = 1000
  #STAGEHEIGHT = 500
  #SITEWIDTH = 20

  connect() {
    this.#setupStage()
    this.#setupLayer()
    this.#drawCanvas()
  }

  #drawCanvas() {
    const meterInPixels = this.#STAGEWIDTH / this.#SITEWIDTH
    const mangoSiteSpacing = 5

    var line = new Konva.Line({
      points: [0, 250, 500, 250, 1000, 250],
      stroke: "black",
      strokeWidth: 4,
      id: "line"
    })
    this.#layer.add(line)

    var group = new Konva.Group({
      x: 20,
      y: 250,
      draggable: true
    })
    var circle = new Konva.Circle({
      radius: 10,
      fill: "green",
      name: 'fillShape'
    })
    group.add(circle)
    var boundingBox = circle.getClientRect({ relativeTo: group })
    var box = new Konva.Rect({
      x: boundingBox.x,
      y: boundingBox.y,
      width: meterInPixels * 5,
      height: 20,
      strokeWidth: 1,
      cornerRadius: 10,
      name: "box"
    })
    group.add(box)
    this.#layer.add(group)

    var group2 = new Konva.Group({
      x: 600,
      y: 250,
      draggable: true
    })
    var circle2 = new Konva.Circle({
      radius: 10,
      fill: "green",
      name: 'fillShape'
    })
    group2.add(circle2)
    var boundingBox2 = circle2.getClientRect({ relativeTo: group2 })
    var box2 = new Konva.Rect({
      x: boundingBox2.x,
      y: boundingBox2.y,
      width: meterInPixels * 5,
      height: 20,
      strokeWidth: 1,
      cornerRadius: 10,
      name: "box"
    })
    group2.add(box2)
    this.#layer.add(group2)

    this.#layer.on("dragmove", (e) => {
      var target = e.target
      var targetRect = target.getClientRect()

      this.#layer.children.forEach((shape) => {
        if (shape == target || shape == line) {
          return
        }

        if (this.#haveIntersection(shape.getClientRect(), targetRect)) {
          shape.findOne('.box').fill("red").opacity(0.3)
        } else {
          shape.findOne('.box').fill("")
        }
      })
    })
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
    return !(
      r2.x > r1.x + r1.width ||
      r2.x + r2.width < r1.x ||
      r2.y > r1.y + r1.height ||
      r2.y + r2.height < r1.y
    );
  }
}
