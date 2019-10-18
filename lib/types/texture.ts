import { Game } from '..'

/**
 * Loads an image and provides access to it.
 *
 * ### Example
 * ```typescript
 * const texture = new Texture('assets/images/tilesheet.png')
 * ```
 *
 * @category kilo/types
 */
export class Texture {
  /** The loaded image. */
  img: HTMLImageElement

  /**
   * Initialize Texture oobject.
   *
   * @param url Relative path to image file.
   */
  constructor(url: string) {
    this.img = Game.assets.image(url)
  }
}
