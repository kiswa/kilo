import { Container } from '..'
import { Sprite } from '../types'

/**
 * Abstract class to extend for specific renderers.
 */
export abstract class Renderer {
  protected width: number
  protected height: number
  protected canvas: HTMLCanvasElement

  get canvasElement() {
    return this.canvas
  }

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.canvas = document.createElement('canvas')
    this.canvas.id = 'kilo-canvas'
  }

  abstract render(container: Container, clear?: boolean): void

  abstract isInCamera(entity: Sprite, camera: any): boolean
}
