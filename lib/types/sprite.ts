import { Entity, Vec, Texture, HitBox } from '.'

/**
 * An entity with additional properties for collision testing and display.
 *
 * ### Example
 * ```typescript
 * const texture = new Texture('assets/images/bullet.png')
 * const bullet = new Sprite(texture)
 *
 * bullet.hitBox.set(4, 2, 16, 12)
 * bullet.anchor.set(16, 16)
 * ```
 *
 * @category kilo/types
 */
export class Sprite extends Entity {
  /** The hitbox of the sprite. */
  public hitBox: HitBox
  /** The rotation of the sprite. */
  public rotation: number

  private _texture: Texture

  private _anchor: Vec
  private _pivot: Vec

  private _height: number
  private _width: number

  /** Gets the texture. */
  get texture() {
    return this._texture
  }

  /** Gets the anchor point. */
  get anchor() {
    return this._anchor
  }

  /** Gets the pivot point. */
  get pivot() {
    return this._pivot
  }

  /** Gets the height. */
  get height() {
    return this._height
  }

  /** Gets the width. */
  get width() {
    return this._width
  }

  /** Sets the height. */
  set height(value) {
    this._height = value
  }

  /** Sets the width. */
  set width(value) {
    this._width = value
  }

  /**
   * Initialize Sprite object.
   *
   * @param texture The texture for the sprite.
   */
  constructor(texture: Texture) {
    super()

    this._texture = texture
    this._anchor = new Vec()
    this._pivot = new Vec()
    this._height = 0
    this._width = 0

    this.hitBox = new HitBox(0, 0, 0, 0)
    this.rotation = 0
  }

  /**
   * Empty implementation from extending [[Entity]].
   *
   * @param _ Not used.
   * @param __ Not used.
   */
  update(_: number, __: number) {}
}
