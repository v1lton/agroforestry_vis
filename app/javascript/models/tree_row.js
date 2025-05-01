/**
 * Represents a tree row in the agroforestry visualization.
 * A TreeRow is a straight line defined by a start and end point.
 */
export class TreeRow {
  /**
   * Creates a new TreeRow instance.
   * @param {Object} options - The coordinates for the tree row.
   * @param {number} options.originX - The X coordinate of the starting point.
   * @param {number} options.originY - The Y coordinate of the starting point.
   * @param {number} options.endX - The X coordinate of the ending point.
   * @param {number} options.endY - The Y coordinate of the ending point.
   */
  constructor({ originX, originY, endX, endY }) {
    this.originX = originX;
    this.originY = originY;
    this.endX = endX;
    this.endY = endY;

    this.line = this.#buildShapeRepresentation()
  }

  /**
   * Gets the Konva line shape representation of the tree row.
   * @returns {Konva.Line} The Konva line instance representing the tree row.
   */
  get shapeRepresentation() {
    return this.line;
  }

  /**
   * Gets the unique ID of the line shape.
   * @returns {string} The ID of the Konva line shape.
   */
  get id() {
    return this.line._id;
  }

  /**
   * Builds the Konva line shape representing the tree row.
   * This should be called before accessing shapeRepresentation or id.
   * @private
   */
  #buildShapeRepresentation() {
    const line = new Konva.Line({
      points: [this.originX, this.originY, this.endX, this.endY],
      stroke: "black",
      strokeWidth: 4,
      name: "treeRowRepresentation"
    });

    return line;
  }
}
