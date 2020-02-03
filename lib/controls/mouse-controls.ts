/**
 * @packageDocumentation
 * @module kilo/Controls
 */
import { Vec } from '../types'

/** Provides access to mouse events. */
export class MouseControls {
  private el: HTMLCanvasElement
  private rect: ClientRect | DOMRect

  /** Position of the mouse. */
  pos: Vec
  /** Whether the mouse button is down. */
  isDown: boolean
  /** Whether the mouse button was just pressed. */
  pressed: boolean
  /** Whether the mouse button was just released. */
  released: boolean

  /**
   * Initialize MouseControls object.
   *
   * @param container The canvas element to use for relative mouse coordinates.
   */
  constructor(container: HTMLCanvasElement) {
    this.el = container

    this.pos = new Vec()
    this.isDown = false
    this.pressed = false
    this.released = false
    this.resize()

    document.addEventListener('mousedown', e => this.down(e), false)
    document.addEventListener('mouseup', _ => this.up(), false)
    document.addEventListener('mousemove', e => this.move(e), false)
    document.addEventListener('resize', _ => this.resize(), false)
  }

  /**
   * Update mouse values.
   *
   * Should be called in parent object's update function.
   */
  update() {
    this.released = false
    this.pressed = false
  }

  private down(e: MouseEvent) {
    this.isDown = true
    this.pressed = true
    this.mousePosFromEvent(e)
  }

  private up() {
    this.isDown = false
    this.released = true
  }

  private move(e: MouseEvent) {
    this.mousePosFromEvent(e)
  }

  private resize() {
    this.rect = this.el.getBoundingClientRect()
  }

  private mousePosFromEvent(e: MouseEvent) {
    const { clientX, clientY } = e
    const xr = this.el.width / this.el.clientWidth
    const yr = this.el.height / this.el.clientHeight

    this.pos.x = (clientX - this.rect.left) * xr
    this.pos.y = (clientY - this.rect.top) * yr
  }
}
