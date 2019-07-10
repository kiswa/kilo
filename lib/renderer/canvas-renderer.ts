/**
 * @module kilo/renderer
 */
import { Container, Game } from '../'
import { Entity, Sprite, Text } from '../types'

/**
 * Recursive rendering utilizing HTML5 canvas.
 */
export class CanvasRenderer {
  private width: number
  private height: number
  private ctx: CanvasRenderingContext2D
  private ctx2: CanvasRenderingContext2D
  private buffer: HTMLCanvasElement
  private canvas: HTMLCanvasElement

  get canvasElement() {
    return this.canvas
  }

  /**
   * Initialize CanvasRenderer object.
   *
   * @param width Width of the canvas in pixels.
   * @param height Height of the canvas in pixels.
   * @param container The HTMLElement to add the canvas to.
   */
  constructor(width: number, height: number, container: HTMLElement) {
    this.buffer = document.createElement('canvas')
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'kilo-canvas'

    this.width = this.buffer.width = this.canvas.width = width
    this.height = this.buffer.height = this.canvas.height = height

    this.ctx = this.buffer.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.ctx.textBaseline = 'top'

    this.ctx2 = this.canvas.getContext('2d')

    container.appendChild(this.canvas)
  }

  /**
   * Recursive method for rendering the provided container and all its children.
   *
   * @param container Container object to render recursively.
   * @param clear Whether or not to clear the canvas before rendering.
   */
  render(container: Container, clear = true) {
    if (!container.visible || container.alpha <= 0) {
      return
    }

    if (clear) {
      this.ctx.clearRect(0, 0, this.width, this.height)
    }

    this.renderRecursive(container)

    if (Game.debug) {
      const { ctx } = this

      ctx.save()

      ctx.fillStyle = 'rgba(51, 51, 51, .5)'
      ctx.fillRect(0, 0, 160, 30)

      ctx.font = '12pt monospace'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'

      ctx.fillText(`FPS: ${Game.FPS} UPS: ${Game.UPS}`, 7, 7)

      ctx.restore()
    }

    this.ctx2.clearRect(0, 0, this.width, this.height)
    this.ctx2.drawImage(this.buffer, 0, 0)
  }

  private isInCamera(entity: Sprite, camera: any) {
    return entity.pos.x + entity.width >= -camera.pos.x &&
      entity.pos.x <= -camera.pos.x + camera.width &&
      entity.pos.y + entity.height >= -camera.pos.y &&
      entity.pos.y <= -camera.pos.y + camera.height
  }

  private renderRecursive(container: Entity | Container,
                          camera?: Entity | Container) {
    const { ctx } = this

    if (container.alpha) {
      ctx.save()
      ctx.globalAlpha = container.alpha
    }

    for (let i = 0; i < container.children.length; i++) {
      const child = (container as any).children[i]

      if (!child.visible || child.alpha <= 0) {
        continue
      }

      if (camera && !(child instanceof Container || child instanceof Text) &&
          !this.isInCamera(child, camera)) {
        continue
      }

      ctx.save()

      if (child.alpha) {
        ctx.globalAlpha = child.alpha
      }

      ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y))

      if (child.anchor) ctx.translate(child.anchor.x, child.anchor.y)
      if (child.scale) ctx.scale(child.scale.x, child.scale.y)

      if (child.rotation) {
        const px = child.pivot ? child.pivot.x : 0
        const py = child.pivot ? child.pivot.y : 0

        ctx.translate(px, py)
        ctx.rotate(child.rotation)
        ctx.translate(-px, -py)
      }

      if (child.text) {
        const { font, fill, align } = child.style

        if (font && font.length) ctx.font = font
        if (fill && fill.length) ctx.fillStyle = fill
        if (align && align.length) ctx.textAlign = align

        ctx.fillText(child.text, 0, 0)
      }

      if (child.texture) {
        const img = child.texture.img

        if (child.tileWidth && child.frame) {
          ctx.drawImage(img,
            child.frame.x * child.tileWidth,
            child.frame.y * child.tileHeight,
            child.tileWidth,
            child.tileHeight,
            0, 0,
            child.tileWidth,
            child.tileHeight)
        } else {
          ctx.drawImage(img, 0, 0)
        }
      }

      if (child.style && child.width && child.height) {
        ctx.fillStyle = child.style.fill
        ctx.fillRect(0, 0, child.width, child.height)
      }

      if (child.path) {
        const [head, ...tail]: { x: number, y: number }[] = child.path

        if (child.path.length) {
          ctx.fillStyle = child.style.fill || '#fff'
          ctx.beginPath()

          ctx.moveTo(head.x, head.y)
          for (let i = 0; i < tail.length; i++) {
            ctx.lineTo(tail[i].x, tail[i].y)
          }

          ctx.closePath()
          ctx.fill()
        }
      }

      if (child.hasChildren) {
        this.renderRecursive(child, child.worldSize ? child : camera)
      }

      ctx.restore()
    }

    if (container.alpha) {
      ctx.restore()
    }
  }

}
