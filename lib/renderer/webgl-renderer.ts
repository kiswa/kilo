/**
 * @module kilo/renderer
 */
import { Renderer } from './renderer'
import { Camera, Container, Game, TileSprite } from '../'
import { Entity, Sprite, Text } from '../types'
import { ShaderProgram, GLUtils } from './webgl'
import { defaults } from './webgl/defaults'

interface TextureInfo {
  texture: WebGLTexture
}

/**
 * Recursive rendering utilizing HTML5 canvas and WebGL.
 */
export class WebGLRenderer extends Renderer {
  private gl: WebGLRenderingContext
  private ctx: CanvasRenderingContext2D
  private shaderProgram: ShaderProgram

  private positionBuffer: WebGLBuffer
  private textureBuffer: WebGLBuffer
  private textures: Map<string, TextureInfo>

  private fullArea = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

    /**
     * Initialize CanvasRenderer object.
     *
     * @param width Width of the canvas in pixels.
     * @param height Height of the canvas in pixels.
     * @param container The HTMLElement to add the canvas to.
     */
    constructor(width: number, height: number, container: HTMLElement) {
      super(width, height, container)

      this.gl = this.canvas.getContext('webgl', { antialias: false })
      this.positionBuffer = this.gl.createBuffer()
      this.textureBuffer = this.gl.createBuffer()

      this.createTextCanvas()

      this.textures = new Map<string, TextureInfo>()
      this.shaderProgram = new ShaderProgram(this.gl, defaults.shaders)
    }

  render(container: Container, clear = true) {
    if (!container.visible || container.alpha <= 0) {
      return
    }

    if (clear) {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT)
      this.ctx.clearRect(0, 0, this.width, this.height)
    }

    this.renderRecursive(container)

    if (Game.debug) {
      const { ctx } = this

      ctx.save()

      ctx.fillStyle = 'rgba(51, 51, 51, .5)'
      ctx.fillRect(0, 0, 160, 25)

      ctx.font = '12pt monospace'
      ctx.fillStyle = '#fff'
      ctx.textAlign = 'left'

      ctx.fillText(`FPS: ${Game.FPS} UPS: ${Game.UPS}`, 7, 17)

      ctx.restore()
    }
  }

  isInCamera(entity: Sprite, camera: any) {
    return entity.pos.x + entity.width >= -camera.pos.x &&
      entity.pos.x <= -camera.pos.x + camera.width &&
      entity.pos.y + entity.height >= -camera.pos.y &&
      entity.pos.y <= -camera.pos.y + camera.height
  }

  private renderRecursive(container: Entity | Container,
                          camera?: Camera) {
    const { gl } = this

    this.setBuffer(gl, this.positionBuffer,
      this.shaderProgram.getAttribLocation('a_position'))

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
          this.drawTileSprite(gl, child, camera)
        } else {
          this.drawSprite(gl, child, camera)
        }
      }

      if (child.hasChildren) {
        this.renderRecursive(child, child.worldSize
          ? (child as Camera)
          : camera)
      }
    }
  }

  private drawSprite(gl: WebGLRenderingContext,
                     sprite: Sprite,
                     camera: Camera) {
    const { shaderProgram } = this

    this.setBuffer(gl, this.textureBuffer,
      shaderProgram.getAttribLocation('a_texCoord'))

    const tex = this.getTexture(gl, sprite)

    let cameraTranslation = GLUtils.getTranslation(0, 0)

    if (camera) {
      cameraTranslation = GLUtils.getTranslation(camera.pos.x, camera.pos.y)
    }

    const originMatrix = GLUtils.getTranslation(0, 0)
    const projectionMatrix = GLUtils.get2DProjectionMatrix(this.width, this.height)
    const translationMatrix = GLUtils.getTranslation(sprite.pos.x, sprite.pos.y)
    let scaleMatrix = GLUtils.getScale(sprite.width, sprite.height)

    if (sprite.scale) {
      scaleMatrix = GLUtils.getScale(sprite.width * sprite.scale.x,
        sprite.height * sprite.scale.y)
    }

    let posMatrix = GLUtils.multiplyMatrices(scaleMatrix, originMatrix)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, cameraTranslation)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, translationMatrix)

    if (sprite.anchor) {
      const anchorMatrix = GLUtils.getTranslation(sprite.anchor.x, sprite.anchor.y)
      posMatrix = GLUtils.multiplyMatrices(posMatrix, anchorMatrix)
    }

    posMatrix = GLUtils.multiplyMatrices(posMatrix, projectionMatrix)

    const texMatrix = GLUtils.getScale( sprite.width / sprite.texture.img.width,
      sprite.height / sprite.texture.img.height)

    gl.uniformMatrix3fv(shaderProgram.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniformMatrix3fv(shaderProgram.getUniformLocation('u_texMatrix'),
      false, texMatrix)

    gl.uniform1i(shaderProgram.getUniformLocation('u_sampler'), 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  private drawTileSprite(gl: WebGLRenderingContext,
                         sprite: TileSprite,
                         camera: Camera) {
    const { shaderProgram } = this

    this.setBuffer(gl, this.textureBuffer,
      shaderProgram.getAttribLocation('a_texCoord'))

    const tex = this.getTexture(gl, sprite)

    let cameraTranslation = GLUtils.getTranslation(0, 0)

    if (camera) {
      cameraTranslation = GLUtils.getTranslation(
        Math.floor(camera.pos.x), Math.floor(camera.pos.y))
    }

    const originMatrix = GLUtils.getTranslation(0, 0)
    const projectionMatrix = GLUtils.get2DProjectionMatrix(this.width, this.height)
    const translationMatrix = GLUtils.getTranslation(sprite.pos.x, sprite.pos.y)
    let scaleMatrix = GLUtils.getScale(sprite.tileWidth, sprite.tileHeight)

    if (sprite.scale) {
      scaleMatrix = GLUtils.getScale(sprite.tileWidth * sprite.scale.x,
        sprite.tileHeight * sprite.scale.y)
    }

    let posMatrix = GLUtils.multiplyMatrices(scaleMatrix, originMatrix)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, cameraTranslation)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, translationMatrix)

    if (sprite.anchor) {
      const anchorMatrix = GLUtils.getTranslation(sprite.anchor.x, sprite.anchor.y)
      posMatrix = GLUtils.multiplyMatrices(posMatrix, anchorMatrix)
    }

    posMatrix = GLUtils.multiplyMatrices(posMatrix, projectionMatrix)

    const texScaleMatrix = GLUtils.getScale(
      sprite.tileWidth / sprite.texture.img.width,
      sprite.tileHeight / sprite.texture.img.height
    )
    const texOffsetMatrix = GLUtils.getTranslation(
      sprite.frame.x * sprite.tileWidth / sprite.texture.img.width,
      sprite.frame.y * sprite.tileHeight / sprite.texture.img.height
    )

    const texMatrix = GLUtils.multiplyMatrices(texScaleMatrix, texOffsetMatrix)

    gl.uniformMatrix3fv(shaderProgram.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniformMatrix3fv(shaderProgram.getUniformLocation('u_texMatrix'),
      false, texMatrix)

    gl.uniform1i(shaderProgram.getUniformLocation('u_sampler'), 0)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  private getTexture(gl: WebGLRenderingContext, sprite: Sprite | TileSprite) {
    if (!Game.assets.completed) {
      return null
    }

    const { img } = sprite.texture

    if (!img.complete) {
      if (Game.debug) {
        console.warn(`Image ${img.src} not yet loaded...`)
      }

      return null
    }

    if (this.textures.has(img.src)) {
      const texture = this.textures.get(img.src).texture
      gl.bindTexture(gl.TEXTURE_2D, texture)

      return texture
    }

    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

    this.textures.set(img.src, { texture })

    return texture
  }

  private setBuffer(gl: WebGLRenderingContext,
                    buffer: WebGLBuffer, attrib: number) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.fullArea, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(attrib)
    gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0)
  }

  private createTextCanvas() {
    const canvas = document.createElement('canvas')

    canvas.width = this.width
    canvas.height = this.height

    canvas.id = 'kilo-text-canvas'
    canvas.style.zIndex = '1000'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'

    this.container.appendChild(canvas)
    this.ctx = canvas.getContext('2d')
  }
}
