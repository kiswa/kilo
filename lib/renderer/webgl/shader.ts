export class Shader {
  private gl: WebGLRenderingContext
  private _program: WebGLProgram
  private attributes: { [name: string]: number }
  private uniforms: { [name: string]: WebGLUniformLocation }
  private name: string

  get program() {
    return this._program
  }

  constructor(gl: WebGLRenderingContext, name = 'default') {
    this.gl = gl
    this.name = name
    this.attributes = {}
    this.uniforms = {}
  }

  public load(vertexSource: string, fragmentSource: string) {
    const vertexShader =
      this.loadShader(vertexSource, this.gl.VERTEX_SHADER)
    const fragmentShader =
      this.loadShader(fragmentSource, this.gl.FRAGMENT_SHADER)

    this.createProgram(vertexShader, fragmentShader)

    this.getAttributes()
    this.getUniforms()
  }

  public destroy() {
    this.gl.deleteProgram(this._program)
  }

  public getAttribLocation(name: string) {
    if (this.attributes[name] === undefined) {
      throw new Error(`Unknown attribute "${name}" in shader "${this.name}".`)
    }

    return this.attributes[name]
  }

  public getUniformLocation(name: string) {
    if (this.uniforms[name] === undefined) {
      throw new Error(`Unknown uniform "${name}" in shader "${this.name}".`)
    }

    return this.uniforms[name]
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this._program = this.gl.createProgram()

    this.gl.attachShader(this._program, vertexShader)
    this.gl.attachShader(this._program, fragmentShader)
    this.gl.linkProgram(this._program)

    const success = this.gl.getProgramParameter(this._program, this.gl.LINK_STATUS)
    if (!success) {
      const message = this.gl.getProgramInfoLog(this._program)
      this.gl.deleteProgram(this._program)

      throw new Error(message)
    }
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    const shader = this.gl.createShader(shaderType)

    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)

    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)
    if (!success) {
      const message = this.gl.getShaderInfoLog(shader)
      this.gl.deleteShader(shader)

      throw new Error(message)
    }

    return shader
  }

  private getAttributes() {
    const { gl, _program } = this
    const attribs = gl.getProgramParameter(_program, gl.ACTIVE_ATTRIBUTES)

    for (let i = 0; i < attribs; ++i) {
      const info = gl.getActiveAttrib(_program, i)

      if (!info) {
        break
      }

      this.attributes[info.name] = gl.getAttribLocation(_program, info.name)
    }
  }

  private getUniforms() {
    const { gl, _program } = this
    const uniforms = gl.getProgramParameter(_program, gl.ACTIVE_UNIFORMS)

    for (let i = 0; i < uniforms; ++i) {
      const info = gl.getActiveUniform(_program, i)

      if (!info) {
        break
      }

      this.uniforms[info.name] = gl.getUniformLocation(_program, info.name)
    }
  }
}
