import { expect } from 'chai'

import { KeyControls } from '../lib/'

describe('KeyControls', () => {
  let ctrls: KeyControls

  const keyDown = (code: string) => {
    const evt = new KeyboardEvent('keydown', <any>{ code })

    document.dispatchEvent(evt)
  }

  const keyUp = (code: string) => {
    const evt = new KeyboardEvent('keyup', <any>{ code })

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
      keyDown('KeyA')
      expect(ctrls.x).to.equal(-1)

      keyUp('KeyA')
      expect(ctrls.x).to.equal(0)

      keyDown('ArrowLeft')
      expect(ctrls.x).to.equal(-1)

      keyUp('ArrowLeft')
      expect(ctrls.x).to.equal(0)

      keyDown('KeyD')
      expect(ctrls.x).to.equal(1)

      keyUp('KeyD')
      expect(ctrls.x).to.equal(0)

      keyDown('ArrowRight')
      expect(ctrls.x).to.equal(1)

      keyUp('ArrowRight')
      expect(ctrls.x).to.equal(0)
    })

    it('has get accessor y', () => {
      keyDown('KeyW')
      expect(ctrls.y).to.equal(-1)

      keyUp('KeyW')
      expect(ctrls.y).to.equal(0)

      keyDown('ArrowUp')
      expect(ctrls.y).to.equal(-1)

      keyUp('ArrowUp')
      expect(ctrls.y).to.equal(0)

      keyDown('KeyS')
      expect(ctrls.y).to.equal(1)

      keyUp('KeyS')
      expect(ctrls.y).to.equal(0)

      keyDown('ArrowDown')
      expect(ctrls.y).to.equal(1)

      keyUp('ArrowDown')
      expect(ctrls.y).to.equal(0)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      ctrls = new KeyControls()
    })

    it('has method key', () => {
      expect(ctrls.key).to.be.a('function')

      let val = ctrls.key('Space')
      expect(val).to.equal(false)

      val = ctrls.key('Space', true)
      expect(val).to.equal(true)
    })

    it('has method reset', () => {
      expect(ctrls.reset).to.be.a('function')

      ctrls.action = true
      expect((<any>ctrls).keys.Space).to.equal(true)

      ctrls.reset()
      expect((<any>ctrls).keys.Space).to.equal(undefined)
    })
  })
})

