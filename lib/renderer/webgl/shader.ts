export class Shader {
  private gl: WebGLRenderingContext
  private program: WebGLProgram
  private attributes: { [name: string]: number }
  private uniforms: { [name: string]: WebGLUniformLocation }
  private name: string

  constructor(gl: WebGLRenderingContext, name = 'default') {
    this.gl = gl
    this.name = name
    this.attributes = {}
    this.uniforms = {}
  }

  protected load(vertexSource: string, fragmentSource: string) {
    const vertexShader =
      this.loadShader(vertexSource, this.gl.VERTEX_SHADER)
    const fragmentShader =
      this.loadShader(fragmentSource, this.gl.FRAGMENT_SHADER)

    this.createProgram(vertexShader, fragmentShader)
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.program = this.gl.createProgram()

    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)

    const success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
    if (!success) {
      const message = this.gl.getProgramInfoLog(this.program)
      this.gl.deleteProgram(this.program)

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
}
