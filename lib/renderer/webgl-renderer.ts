import { Renderer } from './renderer'
import { Camera, Container, Game, Scene, TileSprite } from '../'
import { Entity, Sprite, Text, Rect } from '../types'
import { defaults, ShaderProgram, GlBuffer,  GLUtils } from './webgl'

/**
 * @ignore
 */
interface TextureInfo {
  texture: WebGLTexture
}

/** Recursive rendering utilizing HTML5 canvas and WebGL. */
export class WebGLRenderer extends Renderer {
  private gl: WebGLRenderingContext
  private ctx: CanvasRenderingContext2D
  private shaderProgramTex: ShaderProgram
  private shaderProgramCol: ShaderProgram

  private buffers: GlBuffer
  private textures: Map<string, TextureInfo>
  private boundTexture: string
  private globalAlpha: number
  private game: Game

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

      this.buffers = new GlBuffer(this.gl)
      this.buffers.create('position')
      this.buffers.create('texture')
      this.buffers.create('rect')

      this.createTextCanvas()

      this.textures = new Map<string, TextureInfo>()
      this.shaderProgramTex = new ShaderProgram(this.gl, {
        vertex: defaults.shaders.vertexTexture,
        fragment: defaults.shaders.fragmentTexture,
      }, 'default-texture')
      this.shaderProgramCol = new ShaderProgram(this.gl, {
        vertex: defaults.shaders.vertexColor,
        fragment: defaults.shaders.fragmentColor,
      }, 'default-color')
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

    const { gl } = this

    if (clear) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.ctx.clearRect(0, 0, this.width, this.height)
    }

    gl.useProgram(this.shaderProgramTex.program)

    if (container instanceof Scene) {
      this.game = container.game
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

  private renderRecursive(container: Entity | Container, camera?: Camera) {
    const { gl, ctx } = this

    if (container.alpha >= 0) {
      this.globalAlpha = container.alpha
    }

    this.buffers.setActive('position',
      this.shaderProgramTex.getAttribLocation('a_position'))

    for (let i = 0; i < container.children.length; i++) {
      const child = (container as any).children[i]

      if (!child.visible || child.alpha <= 0) {
        continue
      }

      if (camera && !(child instanceof Container || child instanceof Text) &&
        !this.isInCamera(child, camera)) {
        continue
      }

      if (child.text) {
        const { font, fill, align } = child.style

        ctx.save()

        if (font && font.length) ctx.font = font
        if (fill && fill.length) ctx.fillStyle = fill
        if (align && align.length) ctx.textAlign = align

        if (this.game) {
          child.pos.set(container.pos.x, container.pos.y)

          if (camera) {
            child.pos.x = child.pos.x /
              ((camera as any).worldSize.width / this.game.height)
            child.pos.y = child.pos.y /
              ((camera as any).worldSize.height / this.game.height)
          }
        }

        ctx.fillText(child.text, child.pos.x, child.pos.y)
        ctx.restore()
      }

      if (child.texture) {
        if (child.tileWidth && child.frame) {
          this.drawTileSprite(child, camera)
        } else {
          this.drawSprite(child, camera)
        }
      }

      if (child.style && child.width && child.height) {
        gl.useProgram(this.shaderProgramCol.program)
        this.drawRect(child, camera)
        gl.useProgram(this.shaderProgramTex.program)
      }

      if (child.hasChildren) {
        this.renderRecursive(child, child.worldSize ? child : camera)
      }

      ctx.restore()
    }
  }

  private drawSprite(sprite: Sprite, camera: Camera) {
    const { gl, shaderProgramTex } = this

    this.buffers.setActive('texture',
      shaderProgramTex.getAttribLocation('a_texCoord'))
    this.getTexture(gl, sprite)

    const posMatrix = this.getPositionMatrix(camera, sprite)
    const texMatrix = GLUtils.getScale(sprite.width / sprite.texture.img.width,
      sprite.height / sprite.texture.img.height)

    gl.uniformMatrix3fv(shaderProgramTex.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniformMatrix3fv(shaderProgramTex.getUniformLocation('u_texMatrix'),
      false, texMatrix)

    gl.uniform1f(shaderProgramTex.getUniformLocation('u_texAlpha'),
      this.globalAlpha)
    gl.uniform1i(shaderProgramTex.getUniformLocation('u_sampler'), 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  private drawTileSprite(sprite: TileSprite, camera: Camera) {
    if (sprite.frame.x < 0 || sprite.frame.y < 0) {
      return
    }

    const { gl, shaderProgramTex } = this

    this.buffers.setActive('texture',
      shaderProgramTex.getAttribLocation('a_texCoord'))
    this.getTexture(gl, sprite)

    const posMatrix = this.getPositionMatrix(camera, sprite)
    const texScaleMatrix = GLUtils.getScale(
      sprite.tileWidth / sprite.texture.img.width,
      sprite.tileHeight / sprite.texture.img.height
    )
    const texOffsetMatrix = GLUtils.getTranslation(
      sprite.frame.x * sprite.tileWidth / sprite.texture.img.width,
      sprite.frame.y * sprite.tileHeight / sprite.texture.img.height
    )
    const texMatrix = GLUtils.multiplyMatrices(texScaleMatrix, texOffsetMatrix)

    gl.uniformMatrix3fv(shaderProgramTex.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniformMatrix3fv(shaderProgramTex.getUniformLocation('u_texMatrix'),
      false, texMatrix)

    gl.uniform1f(shaderProgramTex.getUniformLocation('u_texAlpha'),
      this.globalAlpha)
    gl.uniform1i(shaderProgramTex.getUniformLocation('u_sampler'), 0)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
  }

  private drawRect(rect: Rect, camera: Camera) {
    const { gl, shaderProgramCol } = this

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.buffer('rect'))

    const posMatrix = this.getPositionMatrix(camera, rect)
    const color = this.getColorFromFillString(rect.style.fill, rect.alpha)

    gl.uniformMatrix3fv(shaderProgramCol.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniform4fv(shaderProgramCol.getUniformLocation('u_color'), color)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
  }

  private getColorFromFillString(color: string, alpha: number) {
    if (color[0] === '#') {
      color = color.substr(1)
    }

    if (color.length === 3) {
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    }

    if (color.length > 6) {
      const parts = color.split(',')
      parts[0] = parts[0].substr(parts[0].indexOf('(') + 1)

      if (parts.length > 4) {
        throw new Error(`Invalid color string ${color}`)
      }

      if (parts.length === 3) {
        return [
          parseInt(parts[0]), parseInt(parts[1]),
          parseInt(parts[2].replace(')', '')), alpha
        ]
      }

      return [
        parseInt(parts[0]), parseInt(parts[1]),
        parseInt(parts[2]), parseFloat(parts[3].replace(')', ''))
      ]
    }

    const r = parseInt(color.substr(0, 2), 16) / 255
    const g = parseInt(color.substr(2, 2), 16) / 255
    const b = parseInt(color.substr(4, 2), 16) / 255

    return [r, g, b, alpha]
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

      if (this.boundTexture !== img.src) {
        gl.bindTexture(gl.TEXTURE_2D, texture)
        this.boundTexture = img.src
      }

      return texture
    }

    const texture = this.createTexture()
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

    this.textures.set(img.src, { texture })
    this.boundTexture = img.src

    return texture
  }

  private createTexture() {
    const { gl } = this
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    return texture
  }

  private getPositionMatrix(camera: any, sprite: Sprite | TileSprite | Rect) {
    const hasAnchor = (sp: any) => sp.anchor && (sp.anchor.x || sp.anchor.y)

    const cameraTranslation = GLUtils.getCameraTranslation(camera)
    const projectionMatrix =
      GLUtils.get2DProjectionMatrix(this.width, this.height)
    const translationMatrix = hasAnchor(sprite)
      ? GLUtils.getTranslation(sprite.pos.x + (sprite as any).anchor.x,
                               sprite.pos.y + (sprite as any).anchor.y)
      : GLUtils.getTranslation(sprite.pos.x, sprite.pos.y)
    const scaleMatrix =
      GLUtils.getScaleMatrix(sprite, sprite.width, sprite.height)

    let originMatrix = GLUtils.getTranslation(0, 0)

    if ((sprite instanceof Sprite || sprite instanceof TileSprite)
        && sprite.rotation) {
      const pivotMatrix = GLUtils.getTranslation(-sprite.pivot.x, -sprite.pivot.y)
      const unpivotMatrix = GLUtils.getTranslation(sprite.pivot.x, sprite.pivot.y)

      let rotMatrix = GLUtils.getRotation(sprite.rotation)
      rotMatrix = GLUtils.multiplyMatrices(pivotMatrix, rotMatrix)

      originMatrix = GLUtils.multiplyMatrices(originMatrix, rotMatrix)
      originMatrix = GLUtils.multiplyMatrices(originMatrix, unpivotMatrix)
    }

    let posMatrix = GLUtils.multiplyMatrices(scaleMatrix, originMatrix)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, cameraTranslation)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, translationMatrix)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, projectionMatrix)

    return posMatrix
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
