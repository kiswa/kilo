import { expect } from 'chai'

import { GamepadControls } from '../lib/'

describe('GamepadControls', () => {
  let ctrls: GamepadControls

  describe('Properties', () => {
    beforeEach(() => {
      ctrls = new GamepadControls()
    })

    it('has property threshold', () => {
      expect(ctrls).to.have.property('threshold').that.equals(.21)
    })
  })

  describe('Accessors', () => {
    const connectPad = (x = 0, y = 0) => {
      const con = new Event('gamepadconnected')
      ; (con as any).gamepad = {
        index: 0,
        axes: [x, y],
        buttons: [{ pressed: true }]
      }

      dispatchEvent(con)
    }

    const disconnectPad = () => {
      const dis = new Event('gamepaddisconnected')
      ; (dis as any).gamepad = { index: 0 }

      dispatchEvent(dis)
    }

    beforeEach(() => {
      ctrls = new GamepadControls()
      connectPad()
    })

    afterEach(() => {
      disconnectPad()
    })

    it('has get accessor actionA', () => {
      expect(ctrls.actionA).to.equal(true)

      disconnectPad()
      expect(ctrls.actionA).to.equal(false)
    })

    it('has get accessor actionB', () => {
      expect(ctrls.actionB).to.equal(false)
    })

    it('has get accessor actionX', () => {
      expect(ctrls.actionX).to.equal(false)
    })

    it('has get accessor actionY', () => {
      expect(ctrls.actionY).to.equal(false)
    })

    it('has get accessor actionEsc', () => {
      expect(ctrls.actionEsc).to.equal(false)
    })

    it('has get accessor x', () => {
      expect(ctrls.x).to.equal(0)

      disconnectPad()
      expect(ctrls.x).to.equal(0)

      connectPad(.5)
      expect(ctrls.x).to.equal(1)
    })

    it('has get accessor y', () => {
      expect(ctrls.y).to.equal(0)

      disconnectPad()
      connectPad(0, -.5)
      expect(ctrls.y).to.equal(-1)
    })
  })
})

