import { expect } from 'chai'

import { Trigger, HitBox } from '../lib/types'

describe('Trigger', () => {
  let trigger

  describe('Accessors', () => {
    it('has set accessor debug', () => {
      trigger = new Trigger(new HitBox(0, 0, 5, 5), () => {}, () => {})

      expect(trigger).to.have.property('debug')

      trigger.debug = true
      expect(trigger.hasChildren).to.equal(true)

      trigger.debug = false
      expect(trigger.hasChildren).to.equal(false)
    })
  })

  describe('Methods', () => {
    it('has method onEnter', done => {
      const enter = (...args) => {
        expect(args[0]).to.equal('test')
        done()
      }

      trigger = new Trigger(new HitBox(0, 0, 5, 5), enter, () => {})
      trigger.onEnter('test')
    })

    it('has method onExit', done => {
      const exit = (...args) => {
        expect(args[0]).to.equal('test')
        done()
      }

      trigger = new Trigger(new HitBox(0, 0, 5, 5), () => {}, exit)
      trigger.onExit('test')
    })
  })
})

