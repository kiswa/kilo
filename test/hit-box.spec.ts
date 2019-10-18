import { expect } from 'chai'

import { HitBox } from '../lib/types'

describe('HitBox', () => {
  let hitbox: HitBox

  describe('Accessors', () => {
    beforeEach(() => {
      hitbox = new HitBox(2, 2, 8, 8)
    })

    it('has get accessor x', () => {
      expect(hitbox.x).to.equal(2)
    })

    it('has get accessor y', () => {
      expect(hitbox.y).to.equal(2)
    })

    it('has get accessor width', () => {
      expect(hitbox.width).to.equal(8)
    })

    it('has get accessor height', () => {
      expect(hitbox.height).to.equal(8)
    })
  })

  describe('Methods', () => {
    it('has method set', () => {
      hitbox = new HitBox(0, 0, 0, 0)

      expect(hitbox.set).to.be.a('function')

      hitbox.set(2, 2, 8, 8)

      expect(hitbox.x).to.equal(2)
      expect(hitbox.y).to.equal(2)
      expect(hitbox.width).to.equal(8)
      expect(hitbox.height).to.equal(8)
    })
  })
})

