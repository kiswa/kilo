import { expect } from 'chai'

import { KeyControls } from '../lib/'

describe('KeyControls', () => {
  let ctrls: KeyControls

  const keyDown = id => {
    const evt = new KeyboardEvent('keydown', <any>{ which: id })

    document.dispatchEvent(evt)
  }

  const keyUp = id => {
    const evt = new KeyboardEvent('keyup', <any>{ which: id })

    document.dispatchEvent(evt)
  }

  describe('Accessors', () => {
    beforeEach(() => {
      ctrls = new KeyControls()
    })

    it('has get accessor action', () => {
      expect(ctrls.action).to.be.undefined
    })

    it('has set accessor action', () => {
      expect(ctrls.action).to.be.undefined
      ctrls.action = true
      expect(ctrls.action).to.equal(true)
    })

    it('has get accessor actionB', () => {
      expect(ctrls.actionB).to.be.undefined
    })

    it('has get accessor x', () => {
      expect(ctrls.x).to.equal(0)

      ctrls.key(37, true)
      keyDown(37)
      expect(ctrls.x).to.equal(-1)

      keyUp(37)
      ctrls.key(37, false)
      ctrls.key(39, true)
      expect(ctrls.x).to.equal(1)
    })

    it('has get accessor y', () => {
      expect(ctrls.y).to.equal(0)

      ctrls.key(38, true)
      expect(ctrls.y).to.equal(-1)

      ctrls.key(38, false)
      ctrls.key(40, true)
      expect(ctrls.y).to.equal(1)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      ctrls = new KeyControls()
    })

    it('has method reset', () => {
      ctrls.reset()

      expect((<any>ctrls).keys.length).to.equal(0)
    })
  })
})

