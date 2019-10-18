import { Container } from '..'
import { Sprite } from '../types'

/**
 * Abstract class to extend for specific renderers.
 *
 * @category kilo/renderer
 */
export abstract class Renderer {
  protected width: number
  protected height: number
  protected canvas: HTMLCanvasElement
  protected container: HTMLElement

  get canvasElement() {
    return this.canvas
  }

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

  abstract render(container: Container, clear?: boolean): void

  protected isInCamera(entity: Sprite, camera: any) {
    return entity.pos.x + entity.width >= -camera.pos.x &&
      entity.pos.x <= -camera.pos.x + camera.width &&
      entity.pos.y + entity.height >= -camera.pos.y &&
      entity.pos.y <= -camera.pos.y + camera.height
  }

}
