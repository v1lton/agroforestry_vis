/**
 * Represents a plant species in the agroforestry visualization.
 */
export class Species {
  /**
   * Creates a new Species instance.
   * @param {Object} params - The initialization parameters.
   * @param {number} params.x - The x-coordinate of the species.
   * @param {number} params.y - The y-coordinate of the species.
   * @param {string} params.name - The name of the species.
   * @param {string} params.layer - The vertical layer category (e.g., 'emergent', 'high').
   * @param {number} params.spacing - The spacing requirement of the species.
   * @param {string} params.start_crop - The start crop in years of the species.
   * @param {string} params.end_crop - The end crop in years of the species.
   */
  constructor({ x, y, name, layer, spacing, start_crop, end_crop }) {
    this.name = name;
    this.layer = layer;
    this.spacing = spacing;
    this.layer = layer;
    this.start_crop = start_crop;
    this.end_crop = end_crop;

    this.group = this.#buildShapeRepresentation({ x: x, y: y });
  }

  /**
   * Gets the shape representation (Konva Group) of the species.
   * @returns {Konva.Group} The Konva group representing the species.
   */
  get shapeRepresentation() {
    return this.group;
  }

  /**
   * Gets the internal ID of the Konva group.
   * @returns {string} The ID of the Konva group.
   */
  get id() {
    return this.group._id;
  }

  /**
   * Gets the client rectangle of the Konva group.
   * @returns {Object} The client rectangle of the Konva group.
   */
  get clientRect() {
    return this.group.getClientRect();
  }


  // MARK: - Shape Representation

  /**
   * Builds the shape representation for the species using Konva.
   * @private
   * @param {Object} position - The x and y coordinates.
   * @param {number} position.x - The x-coordinate.
   * @param {number} position.y - The y-coordinate.
   * @returns {Konva.Group} The group containing the circle representation.
   */
  #buildShapeRepresentation({ x, y }) {
    const group = new Konva.Group({
      x: x,
      y: y,
      draggable: true,
      name: "speciesRepresentation",
    });

    const circle = new Konva.Circle({
      radius: 10,
      fill: this.#color,
      name: "fillShape",
    });

    group.add(circle);
    return group;
  }

  /**
   * Gets the color associated with the species layer.
   * @private
   * @returns {string} The color string for the layer.
   */
  get #color() {
    const layerColors = {
      emergent: "blue",
      high: "green",
      medium: "yellow",
      low: "red"
    };
    return layerColors[this.layer] || "gray";
  }
}
