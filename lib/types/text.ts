/**
 * @module kilo/types
 */
import { Entity } from '.'

/**
 * Options for text display.
 */
export interface TextOptions {
  /** The font to use. */
  font: string,
  /** The text fill color. */
  fill: string,
  /** Alignment for the text. */
  align?: CanvasTextAlign
}

/**
 * Displays text on the canvas.
 *
 * ### Example
 * ```typescript
 * const text = new Text('Hello world.', { '20px monospace', '#333' })
 * text.pos.set(20, 20)
 * ```
 */
export class Text extends Entity {
  /** The text to display. */
  text: string
  /** The styles used for the text. */
  style: TextOptions

  /**
   * Initialize Text object.
   *
   * @param text The text to display.
   * @param style The styles used for the text.
   */
  constructor(text: string, style: TextOptions) {
    super()

    this.text = text
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
