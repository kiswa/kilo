export class GLUtils {
  static getScale(x: number, y: number) {
    return [
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ]
  }

  static get2DProjectionMatrix(width: number, height: number) {
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ]
  }

  static getTranslation(x: number, y: number) {
    return [
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]
  }

  static multiplyMatrices(a: number[], b: number[]) {
    const a00 = a[0 * 3 + 0]
    const a01 = a[0 * 3 + 1]
    const a02 = a[0 * 3 + 2]
    const a10 = a[1 * 3 + 0]
    const a11 = a[1 * 3 + 1]
    const a12 = a[1 * 3 + 2]
    const a20 = a[2 * 3 + 0]
    const a21 = a[2 * 3 + 1]
    const a22 = a[2 * 3 + 2]
    const b00 = b[0 * 3 + 0]
    const b01 = b[0 * 3 + 1]
    const b02 = b[0 * 3 + 2]
    const b10 = b[1 * 3 + 0]
    const b11 = b[1 * 3 + 1]
    const b12 = b[1 * 3 + 2]
    const b20 = b[2 * 3 + 0]
    const b21 = b[2 * 3 + 1]
    const b22 = b[2 * 3 + 2]

    return [
      a00 * b00 + a01 * b10 + a02 * b20,
      a00 * b01 + a01 * b11 + a02 * b21,
      a00 * b02 + a01 * b12 + a02 * b22,
      a10 * b00 + a11 * b10 + a12 * b20,
      a10 * b01 + a11 * b11 + a12 * b21,
      a10 * b02 + a11 * b12 + a12 * b22,
      a20 * b00 + a21 * b10 + a22 * b20,
      a20 * b01 + a21 * b11 + a22 * b21,
      a20 * b02 + a21 * b12 + a22 * b22,
    ]
  }
}