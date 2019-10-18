import { expect } from 'chai'

import { Sprite, Texture, HitBox, Vec } from '../lib/types'

describe('Sprite', () => {
  const tex = new Texture('')
  let sprite: Sprite

  describe('Properties', () => {
    beforeEach(() => {
      sprite = new Sprite(tex)
    })

    it('has propety hitBox', () => {
      expect(sprite).to.have.property('hitBox').that.is.instanceof(HitBox)
    })

    it('has propety rotation', () => {
      expect(sprite).to.have.property('rotation').that.equals(0)
    })
  })

  describe('Accessors', () => {
    beforeEach(() => {
      sprite = new Sprite(tex)
    })

    it('has get accessor texture', () => {
      expect(sprite).to.have.property('texture').that.equals(tex)
    })

    it('has get accessor anchor', () => {
      expect(sprite).to.have.property('anchor').that.is.instanceof(Vec)
    })

    it('has get accessor pivot', () => {
      expect(sprite).to.have.property('pivot').that.is.instanceof(Vec)
    })

    it('has get accessor height', () => {
      expect(sprite).to.have.property('height').that.equals(0)
    })

    it('has get accessor width', () => {
      expect(sprite).to.have.property('width').that.equals(0)
    })

    it('has set accessor height', () => {
      sprite.height = 2
      expect(sprite).to.have.property('height').that.equals(2)
    })

    it('has set accessor width', () => {
      sprite.width = 2
      expect(sprite).to.have.property('width').that.equals(2)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      sprite = new Sprite(tex)
    })

    it('has method update', () => {
      expect(sprite.update).to.be.a('function')
      sprite.update(0, 0)
    })
  })
})

