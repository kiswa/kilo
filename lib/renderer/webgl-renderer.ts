/**
 * @module kilo/renderer
 */
import { Renderer } from './renderer'
import { Container, Game, TileSprite } from '../'
import { Entity, Sprite, Text } from '../types'
import { createProgramFromScripts, setRectangle } from './webgl/utils'
import { defaults } from './webgl/defaults'

interface TextureInfo {
  texture: WebGLTexture
}

/**
 * Recursive rendering utilizing HTML5 canvas and WebGL.
 */
export class WebGLRenderer extends Renderer {
  private ctx: WebGLRenderingContext
  private program: WebGLProgram

  private attribs: any
  private uniforms: any
  private positionBuffer: WebGLBuffer
  private textureBuffer: WebGLBuffer
  private textures: Map<string, TextureInfo>

    /**
     * Initialize CanvasRenderer object.
     *
     * @param width Width of the canvas in pixels.
     * @param height Height of the canvas in pixels.
     * @param container The HTMLElement to add the canvas to.
     */
    constructor(width: number, height: number, container: HTMLElement) {
      console.log(width, height)
      super(width, height, container)

      this.ctx = this.canvas.getContext('webgl')
      this.attribs = {}
      this.uniforms = {}
      this.textures = new Map<string, TextureInfo>()
      this.positionBuffer = this.ctx.createBuffer()
      this.textureBuffer = this.ctx.createBuffer()
      this.initWebGl()
    }

  render(container: Container, clear = true) {
    if (!container.visible || container.alpha <= 0) {
      return
    }

    const gl = this.ctx

    if (clear) {
      gl.clear(gl.COLOR_BUFFER_BIT)
    }

    this.renderRecursive(container)

    if (Game.debug) {
      // TODO: Make debug text show up.
    }
  }

  isInCamera(entity: Sprite, camera: any) {
    return entity.pos.x + entity.width >= -camera.pos.x &&
      entity.pos.x <= -camera.pos.x + camera.width &&
      entity.pos.y + entity.height >= -camera.pos.y &&
      entity.pos.y <= -camera.pos.y + camera.height
  }

  private renderRecursive(container: Entity | Container,
    camera?: Entity | Container) {
    const gl = this.ctx

    for (let i = 0; i < container.children.length; i++) {
      const child = (container as any).children[i]

      if (!child.visible || child.alpha <= 0) {
        continue
      }

      if (camera && !(child instanceof Container || child instanceof Text) &&
        !this.isInCamera(child, camera)) {
        continue
      }

      this.setBuffer(gl, this.positionBuffer, this.attribs.position)

      setRectangle(gl, {
        x: child.pos.x,
        y: child.pos.y,
        width: child.width,
        height: child.height
      })

      if (child.texture) {
        this.setBuffer(gl, this.textureBuffer, this.attribs.texCoord)
        const texture = this.getTexture(gl, child)
        gl.bindTexture(gl.TEXTURE_2D, texture)
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (child.hasChildren) {
        this.setBuffer(gl, this.positionBuffer, this.attribs.position)
        this.renderRecursive(child, child.worldSize ? child : camera)
      }
    }
  }

  private getTexture(gl: WebGLRenderingContext, sprite: Sprite | TileSprite) {
    if (!Game.assets.completed) {
      return null
    }

    if (this.textures.has(sprite.texture.img.src)) {
      return this.textures.get(sprite.texture.img.src).texture
    }

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
      gl.UNSIGNED_BYTE, sprite.texture.img)

    this.textures.set(sprite.texture.img.src, { texture })

    return texture
  }

  private setBuffer(gl: WebGLRenderingContext,
    buffer: WebGLBuffer, attrib: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(attrib)
    gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0)
  }

  private initWebGl() {
    const gl = this.ctx
    const scripts = defaults.shaders

    this.program = createProgramFromScripts(gl, scripts)

    gl.viewport(0, 0, this.width, this.height)
    gl.clearColor(0, 0, 0, 0)
    gl.useProgram(this.program)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)

    this.attribs.position =
      gl.getAttribLocation(this.program, 'a_position')

    this.attribs.texCoord =
      gl.getAttribLocation(this.program, 'a_texCoord')

    this.uniforms.resolution =
      gl.getUniformLocation(this.program, 'u_resolution')

    this.uniforms.color =
      gl.getUniformLocation(this.program, 'u_color')

    gl.uniform2f(this.uniforms.resolution, gl.canvas.width, gl.canvas.height)
  }
}
