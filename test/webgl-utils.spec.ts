import { expect } from 'chai'

import {GLUtils} from '../lib/renderer/webgl'

describe('GLUtils', () => {
  it('has static method getCameraTranslation', () => {
    expect(GLUtils).to.have.property('getCameraTranslation').that.is.a('function')

    let cameraTranslation = GLUtils.getCameraTranslation(null)

    expect(JSON.stringify(cameraTranslation))
      .to.equal(JSON.stringify([1, 0, 0, 0, 1, 0, 0, 0, 1]))

    cameraTranslation = GLUtils.getCameraTranslation({ pos: { x: 1, y: 1 } })

    expect(JSON.stringify(cameraTranslation))
      .to.equal(JSON.stringify([1, 0, 0, 0, 1, 0, 1, 1, 1]))
  })

  it('has static method getScaleMatrix', () => {
    expect(GLUtils).to.have.property('getScaleMatrix').that.is.a('function')

    let scale =
      GLUtils.getScaleMatrix({ scale: { x: 2, y: 2  } as any } as any, 16, 16)

    expect(JSON.stringify(scale))
      .to.equal(JSON.stringify([32, 0, 0, 0, 32, 0, 0, 0, 1]))

    scale = GLUtils.getScaleMatrix({} as any, 16, 16)

    expect(JSON.stringify(scale))
      .to.equal(JSON.stringify([16, 0, 0, 0, 16, 0, 0, 0, 1]))
  })

  it('has static method getScale', () => {
    expect(GLUtils).to.have.property('getScale').that.is.a('function')

    const scale = GLUtils.getScale(1, 2)
    expect(JSON.stringify(scale))
      .to.equal(JSON.stringify([1, 0, 0, 0, 2, 0, 0, 0, 1]))
  })

  it('has static method getScale', () => {
    expect(GLUtils).to.have.property('get2DProjectionMatrix').that.is.a('function')

    const projection = GLUtils.get2DProjectionMatrix(1, 1)
    expect(JSON.stringify(projection))
      .to.equal(JSON.stringify([2, 0, 0, 0, -2, 0, -1, 1, 1]))
  })

  it('has static method getTranslation', () => {
    expect(GLUtils).to.have.property('getTranslation').that.is.a('function')

    const translation = GLUtils.getTranslation(1, 1)
    expect(JSON.stringify(translation))
      .to.equal(JSON.stringify([1, 0, 0, 0, 1, 0, 1, 1, 1]))
  })

  it('has static method getRotation', () => {
    expect(GLUtils).to.have.property('getRotation').that.is.a('function')

    const rotation = GLUtils.getRotation(.5)
    expect(JSON.stringify(rotation)).to.equal(JSON.stringify([
      0.8775825618903728, -0.479425538604203, 0,
      0.479425538604203, 0.8775825618903728, 0,
      0, 0, 1
    ]))
  })

  it('has static method multiplyMatrices', () => {
    expect(GLUtils).to.have.property('multiplyMatrices').that.is.a('function')

    const scale = GLUtils.getScale(1, 1)
    const matrix = GLUtils.multiplyMatrices(scale, scale)

    expect(JSON.stringify(matrix))
      .to.equal(JSON.stringify([1, 0, 0, 0, 1, 0, 0, 0, 1]))
  })
})

