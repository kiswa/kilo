import { expect } from 'chai'

import { Timer } from '../lib/'

describe('Timer', () => {
  let tmr: Timer

  describe('Properties', () => {
    tmr = new Timer((r: number) => {})

    it('has property dead', () => {
      expect(tmr).to.have.property('dead').that.equals(false)
    })

    it('has property visible', () => {
      expect(tmr).to.have.property('visible').that.equals(false)
    })
  })

  describe('Methods', () => {
    it('has method update', () => {
      tmr = new Timer((r: number) => {
        expect(r).to.equal(.5)
      }, () => {}, 1, .5)

      const anyTmr = (<any>tmr)

      tmr.update(.5)
      expect(anyTmr.elapsed).to.equal(0)
      expect(anyTmr.delay).to.equal(0)

      tmr.update(.5)
      expect(anyTmr.elapsed).to.equal(.5)

      tmr.update(.5)
      expect(tmr.dead).to.equal(true)
    })
  })
})

