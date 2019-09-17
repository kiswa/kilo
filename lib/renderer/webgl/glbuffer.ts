
export interface AttribInfo {
  location: number
  size: number
  offset: number
}

export class GLBuffer {
  private hasAttribLocation: boolean
  private elementSize: number
  private stride: number
  private targetType: number
  private dataType: number
  private mode: number
  private typeSize: number

  private data: number[]
  private attributes: AttribInfo[]

  private gl: WebGLRenderingContext
  private buffer: WebGLBuffer

  public constructor(gl: WebGLRenderingContext, elementSize: number,
    dataType?: number, targetType?: number, mode?: number) {

    this.gl = gl

    this.dataType = dataType || gl.FLOAT
    this.targetType = targetType || gl.ARRAY_BUFFER
    this.mode = mode || gl.TRIANGLES

    this.hasAttribLocation = false
    this.attributes = []
    this.data = []
    this.elementSize = elementSize

    switch (this.dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this.typeSize = 4
        break

      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this.typeSize = 2
        break

      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this.typeSize = 1
        break

      default:
        throw new Error(`Unknown data type "${dataType}".`)
    }

    this.stride = this.elementSize * this.typeSize
    this.buffer = gl.createBuffer()
  }

  public destroy() {
    this.gl.deleteBuffer(this.buffer)
  }

  public bind(normalize = false) {
    this.gl.bindBuffer(this.targetType, this.buffer)

    if (this.hasAttribLocation) {
      for (let a of this.attributes) {
        this.gl.vertexAttribPointer(
          a.location, a.size, this.dataType,
          normalize, this.stride, a.offset * this.typeSize
        )

        this.gl.enableVertexAttribArray(a.location)
      }
    }
  }

  public unbind() {
    for (let a of this.attributes) {
      this.gl.enableVertexAttribArray(a.location)
    }

    this.gl.bindBuffer(this.targetType, this.buffer)
  }

  public addAttribInfo(info: AttribInfo) {
    this.hasAttribLocation = true

    this.attributes.push(info)
  }

  public pushData(data: number[]) {
    for (let d of data) {
      this.data.push(d)
    }
  }

  public upload() {
    this.gl.bindBuffer(this.targetType, this.buffer)

    let bufferData: ArrayBuffer

    switch (this.dataType) {
      case this.gl.FLOAT:
        bufferData = new Float32Array(this.data)
        break

      case this.gl.INT:
        bufferData = new Int32Array(this.data)
        break

      case this.gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this.data)
        break

      case this.gl.SHORT:
        bufferData = new Int16Array(this.data)
        break

      case this.gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this.data)
        break

      case this.gl.BYTE:
        bufferData = new Int8Array(this.data)
        break

      case this.gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this.data)
        break
    }

    this.gl.bufferData(this.targetType, bufferData, this.gl.STATIC_DRAW)
  }

  public draw() {
    if (this.targetType === this.gl.ARRAY_BUFFER) {
      this.gl.drawArrays(this.mode, 0, this.data.length / this.elementSize)
      return
    }

    if (this.targetType === this.gl.ELEMENT_ARRAY_BUFFER) {
      this.gl.drawElements(this.mode, this.data.length, this.dataType, 0)
    }
  }
}
