/**
 * @packageDocumentation
 * @module kilo/Renderer/WebGL
 */

/**
 * @ignore
 */
const fullArea = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1])

/** Data about a WebGL buffer. */
class BufferInfo {
  /** The WebGLBuffer. */
  buffer: WebGLBuffer
  /** Buffer ID in the program. */
  id: number
  /** Lookup name for the buffer. */
  name: string
}

/** Thin wrapper around WebGLBuffer objects, making them easier to manage. */
export class GlBuffer {
  private gl: WebGLRenderingContext
  private buffers: BufferInfo[]
  private activeBuffer: BufferInfo

  /**
   * Initialize GlBuffer object.
   *
   * @param gl WebGLRenderingContext to use for buffer actions.
   */
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl
    this.buffers = []
  }

  /**
   * Gets the buffer with the provided name.
   *
   * @param bufferName The name of the buffer to return.
   */
  buffer(bufferName: string) {
    const buffer = this.buffers.find(x => x.name === bufferName)

    return buffer.buffer
  }

  /**
   * Creates a new buffer with the provided name.
   *
   * @param bufferName The name of the buffer to create.
   */
  create(bufferName: string) {
    const buff = new BufferInfo()
    buff.buffer = this.gl.createBuffer()
    ; (buff.buffer as any).__SPECTOR_Metadata = { bufferName }
    buff.id = this.buffers.length
    buff.name = bufferName

    this.buffers.push(buff)
  }

  /**
   * Sets the named buffer as active, enables the provided attribute,
   * and prepares the buffer for use.
   *
   * @param bufferName The name of the buffer to activate.
   * @param attribLocation The location of the attribute to enable.
   * @param components The number of components per vertex.
   */
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
