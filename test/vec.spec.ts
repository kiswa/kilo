import { expect } from 'chai'

import { Vec } from '../lib/types'

describe('Vec', () => {
  let vec: Vec

  describe('Properties', () => {
    beforeEach(() => {
      vec = new Vec()
    })

    it('has property x', () => {
      expect(vec).to.have.property('x')
    })

    it('has property y', () => {
      expect(vec).to.have.property('y')
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      vec = new Vec()
    })

    it('has static method from', () => {
      expect(Vec.from).to.be.a('function')

      vec.x = 3

      const tmp = Vec.from(vec)

      expect(tmp.x).to.equal(3)
    })

    it('has method set', () => {
      expect(vec.set).to.be.a('function')

      vec.set(3, 3)

      expect(vec.x).to.equal(3)
      expect(vec.y).to.equal(3)
    })

    it('has method copy', () => {
      expect(vec.copy).to.be.a('function')

      vec.copy(new Vec(3, 3))

      expect(vec.x).to.equal(3)
      expect(vec.y).to.equal(3)
    })

    it('has method clone', () => {
      expect(vec.clone).to.be.a('function')

      const tmp = vec.clone()

      expect(tmp.x).to.equal(0)
      expect(tmp.y).to.equal(0)
    })

    it('has method add', () => {
      expect(vec.add).to.be.a('function')

      const tmp = new Vec(3, 3)

      vec.add(tmp)

      expect(vec.x).to.equal(3)
      expect(vec.y).to.equal(3)
    })

    it('has method subtract', () => {
      expect(vec.subtract).to.be.a('function')

      const tmp = new Vec(3, 3)

      vec.subtract(tmp)

      expect(vec.x).to.equal(-3)
      expect(vec.y).to.equal(-3)
    })

    it('has method multiply', () => {
      expect(vec.multiply).to.be.a('function')

      vec.set(1, 1)
      vec.multiply(3)

      expect(vec.x).to.equal(3)
      expect(vec.y).to.equal(3)
    })

    it('has method divide', () => {
      expect(vec.divide).to.be.a('function')

      vec.set(9, 9)
      vec.divide(3)

      expect(vec.x).to.equal(3)
      expect(vec.y).to.equal(3)
    })

    it('has mehod mag', () => {
      expect(vec.mag).to.be.a('function')

      vec.set(2, 3)

      expect(vec.mag()).to.equal(Math.sqrt(2 * 2 + 3 * 3))
    })

    it('has method normalize', () => {
      expect(vec.normalize).to.be.a('function')

      vec.set(3, 3)
      const mag = vec.mag()

      vec.normalize()

      expect(vec.x).to.equal(3 / mag)
      expect(vec.y).to.equal(3 / mag)
    })

    it('has method dot', () => {
      expect(vec.dot).to.be.a('function')

      vec.set(3, 3)
      const tmp = new Vec(2, 2)

      expect(vec.dot(tmp)).to.equal(3 * 2 + 3 * 2)
    })

    it('has method toString', () => {
      expect(vec.toString).to.be.a('function')

      expect(vec.toString()).to.equal('(0, 0)')
    })
  })
})

