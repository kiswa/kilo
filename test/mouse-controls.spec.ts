import { expect } from 'chai'

import { MouseControls } from '../lib/'
import { Vec } from '../lib/types/'

describe('MouseControls', () => {
  let mouse: MouseControls
  let canvas: HTMLCanvasElement

  const mouseDown = () => {
    const evt = new MouseEvent('mousedown', { clientX: 0, clientY: 0 } as any)
    document.dispatchEvent(evt)
  }

  const mouseUp = () => {
    const evt = new MouseEvent('mouseup')
    document.dispatchEvent(evt)
  }

  const resize = () => {
    const evt = new Event('resize')
    document.dispatchEvent(evt)
  }

  describe('Properties', () => {
    beforeEach(() => {
      canvas = document.createElement('canvas')
      mouse = new MouseControls(canvas)
      resize()
    })

    it('has property isDown', () => {
      expect(mouse).to.have.property('isDown').that.equals(false)

      mouseDown()

      expect(mouse.isDown).to.equal(true)
    })

    it('has property pos', () => {
      expect(mouse).to.have.property('pos').that.is.an.instanceof(Vec)
      expect(mouse.pos.x).to.equal(0)
      expect(mouse.pos.y).to.equal(0)
    })

    it('has property pressed', () => {
      expect(mouse).to.have.property('pressed').that.equals(false)

      mouseDown()

      expect(mouse.pressed).to.equal(true)
    })

    it('has property released', () => {
      expect(mouse).to.have.property('released').that.equals(false)

      mouseUp()

      expect(mouse.released).to.equal(true)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      canvas = document.createElement('canvas')
      mouse = new MouseControls(canvas)
    })

    it('has method update', () => {
      expect(mouse.update).to.be.a('function')

      const evt = new MouseEvent('mousemove', { clientX: 1, clientY: 0 } as any)
      document.dispatchEvent(evt)
      const up = new MouseEvent('mouseup')
      document.dispatchEvent(up)

      expect(mouse.released).to.equal(true)

      mouse.update()
      expect(mouse.released).to.equal(false)
    })
  })
})

