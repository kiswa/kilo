import { expect } from 'chai'

import { Types } from '../lib'
import { OneUp, ParticleEmitter, Particle } from '../lib/fx'

describe('FX', () => {
  describe('OneUp', () => {
    describe('Methods', () => {
      it('has method update', () => {
        const one = new OneUp()

        expect(one.update).to.be.a('function')

        one.update(1, 1)
        expect(one.dead).to.equal(true)
      })
    })
  })

  describe('ParticleEmitter', () => {
    describe('Methods', () => {
      it('has method play', () => {
        const emitter = new ParticleEmitter()

        expect(emitter.play).to.be.a('function')

        emitter.play(new Types.Vec())

        expect(emitter.pos.x).to.equal(0)
        expect(emitter.pos.y).to.equal(0)

        emitter.play(new Types.Vec())
      })
    })
  })

  describe('Particle', () => {
    describe('Methods', () => {
      let particle: Particle

      beforeEach(() => {
        particle = new Particle()
      })

      it('has method reset', () => {
        expect(particle.reset).to.be.a('function')

        particle.reset()

        expect(particle.pos.x).to.equal(0)
        expect(particle.pos.y).to.equal(0)
      })

      it('has method update', () => {
        expect(particle.update).to.be.a('function')

        particle.update(1.5)
        particle.reset()
        particle.update(1.5)

        expect(particle.alpha).to.equal(0)
      })
    })
  })
})

