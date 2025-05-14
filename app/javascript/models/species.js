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
      radius: this.radius,
      fill: this.#color,
      name: "fillShape",
    });

    const name = new Konva.Text({
      text: this.name,
      fontSize: 12,
      fontFamily: "Arial",
      fontStyle: "bold",
      fill: "black",
      x: 0,
      y: -16,
      rotation: -64,
      offsetX: 0,
      offsetY: 0,
      listening: false
    })

    group.add(circle);
    group.add(name);
    return group;
  }

  /**
   * Gets the color associated with the species layer.
   * @private
   * @returns {string} The color string for the layer.
   */
  get #color() {
    const layerColors = {
      emergent_layer: "blue",
      high_layer: "green",
      medium_layer: "yellow",
      low_layer: "red"
    };
    return layerColors[this.layer] || "gray";
  }

  /**
   * Gets the radius associated with the species layer and crop period.
   * @private
   * @returns {number} The radius for the layer and crop period.
   */
  get radius() {
    const crop = parseFloat(this.end_crop);
    const radiusTable = {
      emergent_layer: [6, 8, 10],
      high_layer: [5, 7, 9],
      medium_layer: [4, 6, 8],
      low_layer: [3, 5, 7]
    };
    const periodIndex = crop <= 2 ? 0 : crop <= 4 ? 1 : 2;
    return radiusTable[this.layer]?.[periodIndex] || 4;
  }

  /**
   * Gets the absolute position of the circle in the shape representation.
   * @returns {{ x: number, y: number }} The x and y coordinates of the circle.
   */
  get circlePosition() {
    const circle = this.group.findOne(".fillShape");
    return circle.getAbsolutePosition();
  }
}
