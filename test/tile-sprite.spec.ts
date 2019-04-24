import { expect } from 'chai'

import { TileSprite, Animations } from '../lib/'
import { Texture, Vec } from '../lib/types/'

describe('TileSprite', () => {
  let spr: TileSprite
  const tex = new Texture('')

  describe('Properties', () => {
    beforeEach(() => {
      spr = new TileSprite(tex, 16, 16)
    })

    it('has property anims', () => {
      expect(spr).to.have.property('anims').that.is.instanceof(Animations)
    })

    it('has property frame', () => {
      expect(spr).to.have.property('frame').that.has.property('x')
    })

    it('has property tileHeight', () => {
      expect(spr).to.have.property('tileHeight').that.equals(16)
    })

    it('has property tileWidth', () => {
      expect(spr).to.have.property('tileWidth').that.equals(16)
    })
  })

  describe('Accessors', () => {
    beforeEach(() => {
      spr = new TileSprite(tex, 16, 16)
    })

    it('has get accessor height', () => {
      expect(spr.height).to.equal(16)

      spr.scale.y = 1.5
      expect(spr.height).to.equal(24)
    })

    it('has get accessor width', () => {
      expect(spr.width).to.equal(16)

      spr.scale.x = 1.5
      expect(spr.width).to.equal(24)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      spr = new TileSprite(tex, 16, 16)
    })

    it('has method update', () => {
      const next = new Vec(1, 1)
      spr.anims.add('test', [new Vec(), next], .5)
      spr.anims.play('test')

      spr.update(1, 0)

      expect((<any>spr.anims).anims.get('test').curFrame).to.equal(1)
    })
  })
})


