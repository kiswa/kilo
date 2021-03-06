/**
 * @packageDocumentation
 * @module kilo/Types
 */
import { Game } from '..'

/**
 * Loads an image into an HTMLImageElement and provides access to it.
 *
 * ### Example
 * ```typescript
const texture = new Texture('assets/images/tilesheet.png')
```
 */
export class Texture {
  /** The loaded image. */
  img: HTMLImageElement

  /**
   * Initialize Texture object.
   *
   * @param url Relative path to image file.
   */
  constructor(url: string) {
    this.img = Game.assets.image(url)
  }
}
