import { Renderer } from './renderer'
import { Camera, Container, Game, TileSprite } from '../'
import { Entity, Sprite, Text, Rect } from '../types'
import { ShaderProgram, GLUtils } from './webgl'
import { defaults } from './webgl/defaults'

interface TextureInfo {
  texture: WebGLTexture
}

declare const spector: any

/**
 * Recursive rendering utilizing HTML5 canvas and WebGL.
 *
 * @category kilo/renderer
 */
export class WebGLRenderer extends Renderer {
  private gl: WebGLRenderingContext
  private ctx: CanvasRenderingContext2D
  private shaderProgramTex: ShaderProgram
  private shaderProgramCol: ShaderProgram

  private positionBuffer: WebGLBuffer
  private textureBuffer: WebGLBuffer
  private rectBuffer: WebGLBuffer
  private textures: Map<string, TextureInfo>
  private globalAlpha: number

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
      ; (this.positionBuffer as any).__SPECTOR_Metadata = { name: 'positionBuffer' }
      this.textureBuffer = this.gl.createBuffer()
      ; (this.textureBuffer as any).__SPECTOR_Metadata = { name: 'textureBuffer' }
      this.rectBuffer = this.gl.createBuffer()
      ; (this.rectBuffer as any).__SPECTOR_Metadata = { name: 'rectBuffer' }

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

  render(container: Container, clear = true) {
    if (!container.visible || container.alpha <= 0) {
      return
    }

    const { gl } = this

    if (spector) {
      spector.setMarker('Render')
    }

    if (clear) {
      gl.clear(gl.COLOR_BUFFER_BIT)
      this.ctx.clearRect(0, 0, this.width, this.height)
    }

    gl.useProgram(this.shaderProgramTex.program)

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

  private renderRecursive(container: Entity | Container,
                          camera?: Camera) {
    const { gl, ctx } = this
    if (spector) {
      spector.setMarker('Recursive')
      ; (gl as any).__SPECTOR_Metadata = { name: container }
    }

    if (container.alpha) {
      this.globalAlpha = container.alpha
    }

    this.setBuffer(gl, this.positionBuffer,
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

        if (font && font.length) ctx.font = font
        if (fill && fill.length) ctx.fillStyle = fill
        if (align && align.length) ctx.textAlign = align

        ctx.fillText(child.text, child.pos.x, child.pos.y)
      }

      if (child.texture) {
        if (child.tileWidth && child.frame) {
          if (spector) {
            spector.setMarker('Tile Sprite')
          }

          this.drawTileSprite(child, camera)
        } else {
          if (spector) {
            spector.setMarker('Sprite')
          }

          this.drawSprite(child, camera)
        }
      }

      if (child.hasChildren) {
        this.renderRecursive(child, child.worldSize
          ? (child as Camera)
          : camera)
      }

      if (child.style && child.width && child.height) {
        if (spector) {
          spector.setMarker('Rect')
        }

        gl.useProgram(this.shaderProgramCol.program)
        this.drawRect(child, camera)
        gl.useProgram(this.shaderProgramTex.program)
      }
    }

    if (spector) {
      spector.clearMarker()
    }
  }

  private drawSprite(sprite: Sprite, camera: Camera) {
    const { gl, shaderProgramTex } = this

    this.setBuffer(gl, this.textureBuffer,
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

    this.setBuffer(gl, this.textureBuffer,
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

    gl.bindBuffer(gl.ARRAY_BUFFER, this.rectBuffer)

    const posMatrix = this.getPositionMatrix(camera, rect)
    const color = this.getColorFromFillString(rect.style.fill, rect.alpha)

    gl.uniformMatrix3fv(shaderProgramCol.getUniformLocation('u_posMatrix'),
      false, posMatrix)
    gl.uniform4fv(shaderProgramCol.getUniformLocation('u_color'), color)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6)
  }

  private getColorFromFillString(color: string, alpha: number = 1) {
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
      ; (texture as any).__SPECTOR_Metadata = {
        frame: (sprite as any).frame,  name: img.src
      }
      gl.bindTexture(gl.TEXTURE_2D, texture)

      return texture
    }

    const texture = this.createTexture()
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)

    ; (texture as any).__SPECTOR_Metadata = {
      frame: (sprite as any).frame,  name: img.src
    }

    this.textures.set(img.src, { texture })

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

  private setBuffer(gl: WebGLRenderingContext,
                    buffer: WebGLBuffer, attrib: number, components: number = 2) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.fullArea, gl.STATIC_DRAW)
    gl.vertexAttribPointer(attrib, components, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(attrib)
  }

  private getPositionMatrix(camera: any, sprite: Sprite | TileSprite | Rect) {
    const cameraTranslation = GLUtils.getCameraTranslation(camera)
    const originMatrix = GLUtils.getTranslation(0, 0)

    const projectionMatrix =
      GLUtils.get2DProjectionMatrix(this.width, this.height)
    const translationMatrix =
      GLUtils.getTranslation(sprite.pos.x, sprite.pos.y)
    const scaleMatrix =
      GLUtils.getScaleMatrix(sprite, sprite.width, sprite.height)

    let posMatrix = GLUtils.multiplyMatrices(scaleMatrix, originMatrix)

    if (sprite instanceof TileSprite) {
      let rotMatrix = GLUtils.getRotation(sprite.rotation)
      posMatrix = GLUtils.multiplyMatrices(posMatrix, rotMatrix)
    }

    posMatrix = GLUtils.multiplyMatrices(posMatrix, cameraTranslation)
    posMatrix = GLUtils.multiplyMatrices(posMatrix, translationMatrix)

    const sp = (sprite as Sprite | TileSprite)
    if (sp.anchor) {
      const anchorMatrix = GLUtils.getTranslation(sp.anchor.x, sp.anchor.y)
      posMatrix = GLUtils.multiplyMatrices(posMatrix, anchorMatrix)
    }

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
