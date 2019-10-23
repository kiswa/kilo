import { GlBuffer } from './gl-buffer'

interface Scripts {
  vertex: string
  fragment: string
}

const fullArea = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

/**
 * @category kilo/renderer/webgl
 */
export class ShaderProgram {
  private gl: WebGLRenderingContext
  private _program: WebGLProgram
  private attributes: { [name: string]: number }
  private uniforms: { [name: string]: WebGLUniformLocation }
  private name: string

  get program() {
    return this._program
  }

  constructor(gl: WebGLRenderingContext, scripts: Scripts, name = 'default') {
    this.gl = gl
    this.name = name
    this.attributes = {}
    this.uniforms = {}

    this.load(scripts.vertex, scripts.fragment)
  }

  getAttribLocation(name: string) {
    if (this.attributes[name] === undefined) {
      throw new Error(`Unknown attribute ${name} in shader program ${this.name}.`)
    }

    return this.attributes[name]
  }

  getUniformLocation(name: string) {
    if (this.uniforms[name] === undefined) {
      throw new Error(`Unknown uniform ${name} in shader program ${this.name}.`)
    }

    return this.uniforms[name]
  }

  protected load(vertexSource: string, fragmentSource: string) {
    const vertexShader =
      this.loadShader(vertexSource, this.gl.VERTEX_SHADER)
    const fragmentShader =
      this.loadShader(fragmentSource, this.gl.FRAGMENT_SHADER)

    this.createProgram(vertexShader, fragmentShader)
    this.initWebGl()
  }

  private initWebGl() {
    const { gl } = this

    gl.clearColor(0, 0, 0, 1)

    gl.enable(gl.BLEND)
    gl.blendEquation(gl.FUNC_ADD)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.disable(gl.DEPTH_TEST)
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    const { gl } = this
    this._program = gl.createProgram()

    gl.attachShader(this.program, vertexShader)
    gl.attachShader(this.program, fragmentShader)
    gl.linkProgram(this.program)

    const success = gl.getProgramParameter(this.program, gl.LINK_STATUS)
    if (!success) {
      const message = gl.getProgramInfoLog(this.program)
      gl.deleteProgram(this.program)

      throw new Error(message)
    }

    this.findAttributes()
    this.findUniforms()
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    const { gl } = this
    const shader = gl.createShader(shaderType)

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!success) {
      const message = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)

      throw new Error(message)
    }

    return shader
  }

  private findAttributes() {
    const { gl, program } = this
    const attribCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)

    for (let i = 0; i < attribCount; ++i) {
      let info = gl.getActiveAttrib(program, i)
      if (!info) {
        break
      }

      this.attributes[info.name] = gl.getAttribLocation(program, info.name)
    }
  }

  private findUniforms() {
    const { gl, program } = this
    const attribCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < attribCount; ++i) {
      let info = gl.getActiveUniform(program, i)
      if (!info) {
        break
      }

      this.uniforms[info.name] = gl.getUniformLocation(program, info.name)
    }
  }
}
