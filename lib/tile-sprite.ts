/**
 * @packageDocumentation
 * @module kilo
 */
import { Animations } from '.'
import { Point, Sprite, Texture, Vec } from './types'

/**
 * An extended {@link Sprite} that adds frame data, animations, and tile size.
 */
export class TileSprite extends Sprite {
  /** The frame data. Should always have `x` and `y` properties. */
  frame: any | Point
  /** Animations used by the sprite. */
  anims: Animations

  /** Width of the sprite in pixels */
  tileWidth: number
  /** Height of the sprite in pixels */
  tileHeight: number

  /** Gets the width of the sprite in pixels, accounting for scale. */
  get width () {
    return this.tileWidth * Math.abs(this.scale.x)
  }

  /** Gets the height of the sprite in pixels, accounting for scale. */
  get height () {
    return this.tileHeight * Math.abs(this.scale.y)
  }

  /**
   * Initialize TileSprite object.
   *
   * @param texture Texture to use for the sprite.
   * @param width Sprite width in pixels.
   * @param height Sprite height in pixels.
   */
  constructor(texture: Texture, width: number, height: number) {
    super(texture)

    this.tileWidth = width
    this.tileHeight = height

    this.frame = <Point>{}
    this.frame.__proto__ = new Vec()

    this.anims = new Animations(this.frame)
    this.hitBox.set(0, 0, this.width, this.height)
  }

  /**
   * Update the animations.
   *
   * @param dt Delta time since last update.
   * @param _ Not used
   */
  update(dt: number, _: number) {
    this.anims.update(dt)
  }
}
