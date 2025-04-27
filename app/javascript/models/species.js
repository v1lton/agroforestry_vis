export class Species {
  constructor({ x, y, color = "green", radius = 10 , spacing = 10}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.spacing = spacing;

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
      fill: this.color,
      name: "fillShape",
    });

    group.add(circle);
    return group;
  }

  // Public method to access the Konva group
  get shapeRepresentation() {
    return this.group;
  }

  // Public helper to get position
  get Position() {
    return this.group.getAbsolutePosition();
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
