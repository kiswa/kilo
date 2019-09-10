interface Rect {
  x: number,
  y: number,
  width: number,
  height: number,
}

export function createProgramFromScripts(gl: WebGLRenderingContext,
                                         shaders: any): WebGLProgram {
    const vShader = createShader(gl, gl.VERTEX_SHADER, shaders.vertex)
    const fShader = createShader(gl, gl.FRAGMENT_SHADER, shaders.fragment)

    return createProgram(gl, vShader, fShader)
  }

export function createProgram(gl: WebGLRenderingContext,
                              vertexShader: WebGLShader,
                              fragmentShader: WebGLShader): WebGLProgram {
    const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
      const message = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)

      throw new Error(message)
    }

    return program
  }

export function createShader(gl: WebGLRenderingContext,
                             shaderType: number,
                             source: string): WebGLShader {
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

export function setRectangle(gl: WebGLRenderingContext, coords: Rect) {
  const { x: x1, y: y1 } = coords
  const x2 = coords.x + coords.width
  const y2 = coords.y + coords.height

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x2, y2,
  ]), gl.STATIC_DRAW)
}
