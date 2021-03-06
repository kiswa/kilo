import { expect } from 'chai'

import { Animations } from '../lib/'
import { Vec } from '../lib/types'

describe('Animations', () => {
  let anims: Animations

  describe('Methods', () => {
    beforeEach(() => {
      anims = new Animations(new Vec())
    })

    it('has method add', () => {
      expect(anims.add).to.be.a('function')

      anims.add('test', [new Vec(1, 0)], 1)
    })

    it('has method play', () => {
      expect(anims.play).to.be.a('function')

      anims.add('test', [new Vec(1, 0)], 1)
      anims.play('test')
      anims.play('test')
    })

    it('has method stop', () => {
      expect(anims.stop).to.be.a('function')

      anims.stop()
      expect((anims as any).current).to.equal(null)
    })

    it('has method update', () => {
      expect(anims.update).to.be.a('function')

      anims.update(0)

      anims.add('test', [new Vec(1, 0)], 1)
      anims.play('test')

      anims.update(0)
      anims.update(2)

      expect((anims as any).anims.get('test').curFrame).to.equal(1)
    })
  })
})
