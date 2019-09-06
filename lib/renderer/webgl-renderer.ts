/**
 * @module kilo/renderer
 */
import { Renderer } from './renderer'
import { Container, Game } from '../'
import { Entity, Sprite, Text } from '../types'
import { createProgram, createShader, Shaders } from './webgl/utils'
import { vertexShader, fragmentShader } from './webgl/shaders'

/**
 * Recursive rendering utilizing HTML5 canvas and WebGL.
 */
export class WebGLRenderer extends Renderer {
  private ctx: WebGLRenderingContext
  private buffer: HTMLCanvasElement

  private firstRender: boolean

  /**
   * Initialize CanvasRenderer object.
   *
   * @param width Width of the canvas in pixels.
   * @param height Height of the canvas in pixels.
   * @param container The HTMLElement to add the canvas to.
   */
  constructor(width: number, height: number, container: HTMLElement) {
    super(width, height)

    this.buffer = document.createElement('canvas')

    this.buffer.width = this.canvas.width = width
    this.buffer.height = this.canvas.height = height

    this.ctx = this.buffer.getContext('webgl')
    this.firstRender = true

    container.appendChild(this.canvas)
  }

  tmp() {
    const gl = this.ctx

    const vShader = createShader(gl, Shaders.Vertex, vertexShader)
    const fShader = createShader(gl, Shaders.Fragment, fragmentShader)
    const program = createProgram(gl, vShader, fShader)

    const posAttribLocation = gl.getAttribLocation(program, 'a_position')
    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)

    const positions = [0, 0, 0, 0.5, 0.7, 0]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    gl.viewport(0, 0, this.width, this.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.enableVertexAttribArray(posAttribLocation)
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)

    const size = 2
    const dataType = gl.FLOAT
    const primitiveType = gl.TRIANGLES
    const normalize = false
    const stride = 0
    const offset = 0
    const count = 3

    gl.vertexAttribPointer(
      posAttribLocation, size, dataType, normalize, stride, offset)

    gl.drawArrays(primitiveType, offset, count)
  }

  render(container: Container, clear = true) {
    if (this.firstRender) {
      this.tmp()
      this.firstRender = false
    }
  }

  isInCamera(entity: Sprite, camera: any) {
    return true
  }
}
