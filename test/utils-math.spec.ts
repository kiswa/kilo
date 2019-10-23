import { expect } from 'chai'

import { math } from '../lib/utils'
import { Vec } from '../lib/types'

describe('Utils - Math', () => {
  it('has method angle', () => {
    expect(math.angle).to.be.a('function')

    const a = new Vec(1, 1)
    const b = new Vec(1, 2)

    expect(math.angle(a, b)).to.equal(Math.atan2(-1, 0))
  })

  it('has method dirTo', () => {
    expect(math.dirTo).to.be.a('function')

    expect(math.dirTo(Math.atan2(-1, 0)).y).to.equal(-1)
  })

  it('has method clamp', () => {
    expect(math.clamp).to.be.a('function')

    expect(math.clamp(2)).to.equal(1)
    expect(math.clamp(-1)).to.equal(0)

    expect(math.clamp(1234, 123, 1233)).to.equal(1233)
  })

  it('has method distance', () => {
    expect(math.distance).to.be.a('function')

    const a = new Vec()
    const b = new Vec(0, 1)

    expect(math.distance(a, b)).to.equal(1)
  })

  it('has method gauss', () => {
    expect(math.gauss).to.be.a('function')

    expect(math.gauss(0)).to.equal(1)
    expect(math.gauss(1)).to.equal(Math.exp(-1))
    expect(math.gauss(5)).to.equal(Math.exp(-25))
  })

  it('has method gaussDistance', () => {
    expect(math.gaussDistance).to.be.a('function')

    expect(math.gaussDistance(1, 1, 1)).to.equal(1)
    expect(math.gaussDistance(2, 1, 1)).to.equal(math.gauss(1))
  })

  it('has method lerp', () => {
    expect(math.lerp).to.be.a('function')

    expect(math.lerp(1)).to.equal(1)
    expect(math.lerp(1, -1, 2)).to.equal(2 / 3)
  })

  it('has method mix', () => {
    expect(math.mix).to.be.a('function')

    expect(math.mix(0, 1, 2)).to.equal(2)
    expect(math.mix(-1, 1, 2)).to.equal(3)
  })

  it('has method rand', () => {
    expect(math.rand).to.be.a('function')

    expect(math.rand()).to.equal(0)
    expect(math.rand(0, 5)).to.be.within(0, 5)
  })

  it('has method randf', () => {
    expect(math.randf).to.be.a('function')

    expect(math.randf(0)).to.be.within(0, 1)
  })

  it('has method randOneFrom', () => {
    expect(math.randOneFrom).to.be.a('function')

    expect(math.randOneFrom([1, 2])).to.be.oneOf([1, 2])
  })

  it('has method randOneIn', () => {
    expect(math.randOneIn).to.be.a('function')

    expect(math.randOneIn(1)).to.equal(true)
    expect(math.randOneIn()).to.be.a('boolean')

    let trues = 0
    for (let i = 0; i < 1000; i++) {
      trues += math.randOneIn(10) ? 1 : 0
    }

    expect(trues).to.be.closeTo(100, 25)
  })

  it('has method randomSeed', () => {
    expect(math.randomSeed).to.be.a('function')

    expect(math.randomSeed()).to.equal(42) // Default seed
    expect(math.randomSeed(123)).to.equal(123)
  })

  it('has method useSeededRandom', () => {
    expect(math.useSeededRandom).to.be.a('function')

    math.useSeededRandom()
    expect(math.rand()).to.equal(0)

    math.useSeededRandom(false)
    expect(math.rand()).to.be.oneOf([0, 1])
  })

  it('has method smoothStep', () => {
    expect(math.smoothStep).to.be.a('function')

    expect(math.smoothStep(3)).to.equal(1)

    expect(math.smoothStep(3, 1, 3)).to.equal(1)
  })

  describe('Easing Methods', () => {
    const ease = math.ease

    it('has easing method quadIn', () => {
      expect(ease.quadIn).to.be.a('function')

      expect(ease.quadIn(2)).to.equal(4)
    })

    it('has easing method quadOut', () => {
      expect(ease.quadOut).to.be.a('function')

      expect(ease.quadOut(2)).to.equal(0)
    })

    it('has easing method cubicIn', () => {
      expect(ease.cubicIn).to.be.a('function')

      expect(ease.cubicIn(2)).to.equal(8)
    })

    it('has easing method cubicOut', () => {
      expect(ease.cubicOut).to.be.a('function')

      expect(ease.cubicOut(2)).to.equal(2)
    })

    it('has easing method cubicInOut', () => {
      expect(ease.cubicInOut).to.be.a('function')

      expect(ease.cubicInOut(2)).to.equal(5)
      expect(ease.cubicInOut(.3)).to.equal(.108)
    })

    it('has easing method elasticOut', () => {
      expect(ease.elasticOut).to.be.a('function')

      expect(ease.elasticOut(2)).to.equal(.9999990463256836)
    })
  })
})

