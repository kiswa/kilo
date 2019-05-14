import { expect } from 'chai'

import { Camera } from '../lib/'
import { Texture, Sprite, Rect } from '../lib/types/'

describe('Camera', () => {
  const tex = new Texture('')
  let camera: Camera

  describe('Properties', () => {
    beforeEach(() => {
      camera = new Camera(new Sprite(tex), new Rect(5, 5))
    })

    it('has property easing', () => {
      expect(camera).to.have.property('easing').that.equals(.3)
    })
  })

  describe('Methods', () => {
    let anyCam: any

    beforeEach(() => {
      camera = new Camera(new Sprite(tex), new Rect(5, 5))
      anyCam = (<any>camera)
    })

    it('has method setDebug', () => {
      expect(camera.setDebug).to.be.a('function')

      camera.setDebug()
      expect(anyCam.debug).to.be.instanceof(Rect)

      camera.setDebug(false)
      expect(anyCam.children.length).to.equal(0)
    })

    it('has method setTracking', () => {
      expect(camera.setTracking).to.be.a('function')

      camera.setTracking(30, 30)
      expect(anyCam.tracking.x).to.equal(30)
      expect(anyCam.tracking.y).to.equal(30)
    })

    it('has method setSubject', () => {
      expect(camera.setSubject).to.be.a('function')

      const spr = new Sprite(tex)
      spr.pos.set(20, 20)

      camera.setSubject(spr)
      expect(anyCam.subject).to.equal(spr.pos)
    })

    it('has method shake', () => {
      expect(camera.shake).to.be.a('function')

      camera.shake()
      expect(anyCam.shakePower).to.equal(5)
      expect(anyCam.shakeDecay).to.equal(10)
    })

    it('has method flash', () => {
      expect(camera.flash).to.be.a('function')

      camera.flash()
      expect(anyCam.flashRect).to.be.instanceof(Rect)
      expect(anyCam.flashDuration).to.equal(.2)
      expect(anyCam.flashTime).to.equal(.2)
      camera.flash()
    })

    it('has method focus', () => {
      expect(camera.focus).to.be.a('function')

      const spr = new Sprite(tex)
      const anySpr = (<any>spr)
      spr.pos.set(20, 20)
      anySpr._width = 5
      anySpr._height = 5

      camera.setSubject(spr)
      camera.setDebug()
      camera.pos.set(0, 0)
      camera.focus()

      expect(anyCam.debug.pos.x).to.equal(-61.5)
      expect(anyCam.debug.pos.y).to.equal(-45.5)
      expect(camera.pos.x).to.equal(0)
      expect(camera.pos.y).to.equal(0)
      camera.focus(1, false)
    })

    it('has method update', () => {
      expect(camera.update).to.be.a('function')

      const spr = new Sprite(tex)
      const anySpr = (<any>spr)
      spr.pos.set(20, 20)
      anySpr._width = 5
      anySpr._height = 5

      camera.setSubject(spr)
      camera.pos.set(0, 0)
      camera.flash()
      camera.shake()
      camera.update(.05, 1)
      camera.update(1, 1)
      camera.update(1, 1)

      expect(camera.pos.x).to.equal(0)
      expect(camera.pos.y).to.equal(0)

      anyCam.subject = undefined
      camera.update(1, 1)
    })
  })
})

