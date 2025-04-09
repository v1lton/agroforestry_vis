import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    species: Array
  }

  connect() {
    const canvasEl = document.createElement("canvas");
    canvasEl.id = "fabric-test-canvas";
    canvasEl.width = 400;
    canvasEl.height = 300;
    this.element.appendChild(canvasEl);

    const canvas = new fabric.Canvas("fabric-test-canvas");

    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: "red",
      width: 60,
      height: 70
    });

    canvas.add(rect);
  }
}
