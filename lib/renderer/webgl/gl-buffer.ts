const fullArea = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

class BufferInfo {
  buffer: WebGLBuffer
  id: number
  name: string
}

/**
 * @category kilo/renderer/webgl
 */
export class GlBuffer {
  private gl: WebGLRenderingContext
  private buffers: BufferInfo[]
  private activeBuffer: BufferInfo

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.buffers = []
  }

  buffer(bufferName: string) {
    const buffer = this.buffers.find(x => x.name === bufferName)

    return buffer.buffer
  }

  create(bufferName: string) {
    const buff = new BufferInfo()
    buff.buffer = this.gl.createBuffer()
    ; (buff.buffer as any).__SPECTOR_Metadata = { bufferName }
    buff.id = this.buffers.length
    buff.name = bufferName

    this.buffers.push(buff)
  }

  setActive(bufferName: string, attribLocation: number, components: number = 2) {
    const { gl } = this

    const buffer = this.buffers.find(x => x.name === bufferName)

    if (!buffer) {
      throw new Error(`No buffer with name ${bufferName} found to set as active.`)
    }

    if (this.activeBuffer === buffer) {
      return
    }

    this.activeBuffer = buffer

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, fullArea, gl.STATIC_DRAW)
    gl.vertexAttribPointer(attribLocation, components, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(attribLocation)
  }
}
