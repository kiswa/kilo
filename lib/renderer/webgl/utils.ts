import { Sprite, Rect } from '../../types'
import { TileSprite } from '../../tile-sprite'

/** Provides static methods for working with WebGL. */
export class GLUtils {
  /**
   * Gets a translation matrix based upon camera position.
   *
   * @param camera Camera object to translate.
   */
  static getCameraTranslation(camera: any) {
    let cameraTranslation = GLUtils.getTranslation(0, 0)

    if (camera) {
      cameraTranslation = GLUtils.getTranslation(
        Math.floor(camera.pos.x), Math.floor(camera.pos.y))
    }

    return cameraTranslation
  }

  /**
   * Gets a scale matrix based upon entity scale.
   *
   * @param sprite Entity with `scale` property.
   * @param width Width of the entity in pixels.
   * @param height Height of the entity in pixels.
   */
  static getScaleMatrix(sprite: Sprite | TileSprite | Rect,
                        width: number, height: number) {
    let scaleMatrix = GLUtils.getScale(width, height)

    if (sprite.scale) {
      scaleMatrix = GLUtils.getScale(width * sprite.scale.x,
        height * sprite.scale.y)
    }

    return scaleMatrix
  }

  /**
   * Gets a scale matrix based upon provided sizes.
   *
   * @param x Size to scale to in x dimension.
   * @param y Size to scale to in y dimension.
   */
  static getScale(x: number, y: number) {
    return [
      x, 0, 0,
      0, y, 0,
      0, 0, 1
    ]
  }

  /**
   * Gets a simple 2D flat projection matrix from the provided dimensions.
   *
   * @param width Width of view in pixels.
   * @param height Height of view in pixels.
   */
  static get2DProjectionMatrix(width: number, height: number) {
    return [
      2 / width, 0, 0,
      0, -2 / height, 0,
      -1, 1, 1
    ]
  }

  /**
   * Gets a translation matrix from the provided coordinates.
   *
   * @param x Translation for the x dimension.
   * @param y Translation for the y dimension.
   */
  static getTranslation(x: number, y: number) {
    return [
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    ]
  }

  /**
   * Gets a rotation matrix from the provided angle.
   *
   * @param angle Angle in radians.
   */
  static getRotation(angle: number) {
    return [
      Math.cos(-angle), -Math.sin(-angle), 0,
      Math.sin(-angle), Math.cos(-angle), 0,
      0, 0, 1
    ]
  }

  /**
   * Multiplies two matrices together.
   *
   * @param a The first matrix for multiplication.
   * @param b The second matrix for multiplication.
   */
  static multiplyMatrices(a: number[], b: number[]) {
    const [a00, a01, a02, a10, a11, a12, a20, a21, a22] = a
    const [b00, b01, b02, b10, b11, b12, b20, b21, b22] = b

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
