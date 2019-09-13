/**
 * @module kilo/renderer
 */
import { Renderer } from './renderer'
import { Container, Game, TileSprite } from '../'
import { Entity, Sprite, Text } from '../types'
import * as utils from './webgl/utils'
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

  private identity = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

    /**
     * Initialize CanvasRenderer object.
     *
     * @param width Width of the canvas in pixels.
     * @param height Height of the canvas in pixels.
     * @param container The HTMLElement to add the canvas to.
     */
    constructor(width: number, height: number, container: HTMLElement) {
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

      if (child.texture) {
        if (child.tileWidth && child.frame) {
          this.drawTileSprite(gl, child)
        } else {
          this.drawSprite(gl, child)
        }
      }

      if (child.hasChildren) {
        this.setBuffer(gl, this.positionBuffer, this.attribs.position)
        this.renderRecursive(child, child.worldSize ? child : camera)
      }
    }
  }

  private drawSprite(gl: WebGLRenderingContext, sprite: Sprite) {
    this.setBuffer(gl, this.textureBuffer, this.attribs.texCoord)
    const texture = this.getTexture(gl, sprite)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // TODO

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  private drawTileSprite(gl: WebGLRenderingContext, sprite: TileSprite) {
    const tex = this.getTexture(gl, sprite)

    this.setBuffer(gl, this.textureBuffer, this.attribs.texCoord)
    gl.bindTexture(gl.TEXTURE_2D, tex)

    const originMatrix = utils.getTranslation(0, 0)
    const projectionMatrix = utils.get2DProjectionMatrix(this.width, this.height)
    const translationMatrix = utils.getTranslation(sprite.pos.x, sprite.pos.y)
    const scaleMatrix = utils.getScale(sprite.tileWidth, sprite.tileHeight)

    let posMatrix = utils.multiplyMatrices(scaleMatrix, originMatrix)
    posMatrix = utils.multiplyMatrices(posMatrix, translationMatrix)
    posMatrix = utils.multiplyMatrices(posMatrix, projectionMatrix)

    const texScaleMatrix = utils.getScale(
      sprite.tileWidth / sprite.texture.img.width,
      sprite.tileHeight / sprite.texture.img.height
    )
    const texOffsetMatrix = utils.getTranslation(
      sprite.frame.x * sprite.tileWidth / sprite.texture.img.width,
      sprite.frame.y * sprite.tileHeight / sprite.texture.img.height
    )

    const texMatrix = utils.multiplyMatrices(texScaleMatrix, texOffsetMatrix)

    gl.uniformMatrix3fv(this.uniforms.posMatrix, false, posMatrix)
    gl.uniformMatrix3fv(this.uniforms.texMatrix, false, texMatrix)

    gl.uniform1i(this.uniforms.sampler2D, 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
                  gl.UNSIGNED_BYTE, sprite.texture.img)

    this.textures.set(sprite.texture.img.src, { texture })

    return texture
  }

  private setBuffer(gl: WebGLRenderingContext,
                    buffer: WebGLBuffer, attrib: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.identity, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(attrib)
    gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0)
  }

  private initWebGl() {
    const gl = this.ctx
    const scripts = defaults.shaders

    this.program = utils.createProgramFromScripts(gl, scripts)

    gl.viewport(0, 0, this.width, this.height)
    gl.clearColor(0, 0, 0, 1)
    gl.useProgram(this.program)
    gl.enable(gl.BLEND)
    gl.blendEquation(gl.FUNC_ADD)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.disable(gl.DEPTH_TEST)

    this.attribs.position =
      gl.getAttribLocation(this.program, 'a_position')

    this.attribs.texCoord =
      gl.getAttribLocation(this.program, 'a_texCoord')

    this.uniforms.posMatrix =
      gl.getUniformLocation(this.program, 'u_posMatrix')

    this.uniforms.texMatrix =
      gl.getUniformLocation(this.program, 'u_texMatrix')
  }
}
