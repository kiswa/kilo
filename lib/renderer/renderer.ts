/**
 * @module kilo/renderer
 */
import { Container } from '..'
import { Sprite } from '../types'

/**
 * Abstract class to extend for specific renderers.
 *
 * @category kilo/renderer
 */
export abstract class Renderer {
  /** Width of the canvas in pixels. */
  protected width: number
  /** Height of the canvas in pixels. */
  protected height: number
  /** Canvas element for rendering. */
  protected canvas: HTMLCanvasElement
  /** Containing element for the canvas. */
  protected container: HTMLElement

  /**
   * Get the HTMLCanvasElement used for rendering.
   */
  get canvasElement() {
    return this.canvas
  }

  /** Not to be called directly. */
  constructor(width: number, height: number, container: HTMLElement) {
    this.width = width
    this.height = height

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'kilo-canvas'
    this.canvas.width = width
    this.canvas.height = height

    const div = document.createElement('div')
    div.id = 'kilo-container'
    div.style.position = 'relative'
    div.style.height = this.height + 'px'
    div.style.width = this.width + 'px'
    div.style.margin = '0 auto'

    div.appendChild(this.canvas)
    container.appendChild(div)

    this.container = div
  }

  /** To be defined by concrete implementations. */
  abstract render(container: Container, clear?: boolean): void

  /**
   * Determines if the provided entity is visible to the camera.
   *
   * @param entity Sprite to check for visibility.
   * @param camera Camera to use when determining visibility.
   */
  protected isInCamera(entity: Sprite, camera: any) {
    return entity.pos.x + entity.width >= -camera.pos.x &&
      entity.pos.x <= -camera.pos.x + camera.width &&
      entity.pos.y + entity.height >= -camera.pos.y &&
      entity.pos.y <= -camera.pos.y + camera.height
  }

}
