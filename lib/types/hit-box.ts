/**
 * Allows for more precise collision detection.
 *
 * ### Example
 * ```typescript
 * // Creates a hitbox 4 pixels right and down from the top left of the sprite,
 * // with a width of 32 pixels and a height of 40 pixels.
 * player.hitbox = new HitBox(4, 4, 32, 40)
 * ```
 *
 * @category kilo/types
 */
export class HitBox {
  private _x: number
  private _y: number

  private _height: number
  private _width: number

  /** Gets the offset along the X axis from top left. */
  get x() {
    return this._x
  }

  /** Gets the offset along the Y axis from top left. */
  get y() {
    return this._y
  }

  /** Gets the width of the hitbox. */
  get width() {
    return this._width
  }

  /** Gets the height of the hitbox. */
  get height() {
    return  this._height
  }

  /**
   * Initialize HitBox object.
   *
   * @param x X axis offset.
   * @param y Y axis offset.
   * @param width Width of hitbox.
   * @param height Height of hitbox.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this._x = x
    this._y = y

    this._height = height
    this._width = width
  }

  /**
   * Set new values for the hitbox.
   *
   * @param x X axis offset.
   * @param y Y axis offset.
   * @param width Width of hitbox.
   * @param height Height of hitbox.
   */
  set(x: number, y: number, width: number, height: number) {
    this._x = x
    this._y = y

    this._height = height
    this._width = width
  }
}
