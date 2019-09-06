export enum Shaders {
  Vertex,
  Fragment
}

export function createProgram(gl: WebGLRenderingContext,
  vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {

  const program = gl.createProgram()

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    console.log(gl.getProgramInfoLog(program))
    const success = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!success) {
      const message = gl.getProgramInfoLog(program)
      gl.deleteProgram(program)

      throw new Error(message)
    }

    return program
}

export function createShader(gl: WebGLRenderingContext,
  type: Shaders, source: string): WebGLShader {

  const shader = gl.createShader(type === Shaders.Vertex
    ? gl.VERTEX_SHADER
    : gl.FRAGMENT_SHADER)

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  console.log(gl.getShaderInfoLog(shader))
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    const message = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)

    throw new Error(message)
  }

  return shader
}

