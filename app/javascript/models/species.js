export class Species {
  constructor({ x, y, radius = 10 , spacing = 10, layer, start_crop, end_crop }) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.spacing = spacing;
    this.layer = layer;

    this.group = this.#buildRepresentation();
  }

  // Private builder
  #buildRepresentation() {
    const group = new Konva.Group({
      x: this.x,
      y: this.y,
      draggable: true,
      name: "speciesRepresentation",
    });

    const circle = new Konva.Circle({
      radius: this.radius,
      fill: this.#color,
      name: "fillShape",
    });

    group.add(circle);
    return group;
  }

  get #color() {
    const layerColors = {
      emergent: "blue",
      high: "green",
      medium: "yellow",
      low: "red"
    };
    return layerColors[this.layer] || "gray";
  }

  // Public method to access the Konva group
  get shapeRepresentation() {
    return this.group;
  }

  // Expose id for tracking
  get id() {
    return this.group._id;
  }

  // Expose clientRect (e.g. for intersection detection)
  get clientRect() {
    return this.group.getClientRect();
  }
}
