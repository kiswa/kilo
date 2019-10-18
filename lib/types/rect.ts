import { Vec, Entity } from '.'

/**
 * Style options for a Rect.
 *
 * @category kilo/types
 */
export interface RectStyleOptions {
  /** The fill color. */
  fill: string
}

/**
 * Creates a rectangle for rendering.
 *
 * ### Example
 * ```typescript
 * const testObj = new Rect(32, 32, { fill: '#f00' })
 * ```
 *
 * @category kilo/types
 */
export class Rect extends Entity {
  /** Height of the rectangle in pixels. */
  height: number
  /** Width of the rectangle in pixels. */
  width: number

  /** Position of the rectangle. */
  pos: Vec
  /** Style options for the rectangle. */
  style: RectStyleOptions

  /**
   * Initialize Rect object.
   *
   * @param width Width in pixels.
   * @param height Height in pixels.
   * @param style Style options.
   */
  constructor(width: number, height: number, style = { fill: '#333'}) {
    super()

    this.height = height
    this.width = width
    this.style = style
  }

  /**
   * Empty implementation from extending [[Entity]].
   *
   * @param _ Not used.
   * @param __ Not used.
   */
  update(_: number, __: number) {}
}
