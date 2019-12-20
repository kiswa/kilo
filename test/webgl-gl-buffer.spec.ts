import { expect } from 'chai'
import createContext from 'gl'

import { GlBuffer } from '../lib/renderer/webgl'

describe('GlBuffer', () => {
  describe('Methods', () => {
    let glBuffer: GlBuffer

    beforeEach(() => {
      glBuffer = new GlBuffer(createContext(640, 480))
    })

    it('has method buffer', () => {
      expect(glBuffer.buffer).to.be.a('function')

      expect(glBuffer.buffer).to.throw
    })

    it('has method create', () => {
      expect(glBuffer.create).to.be.a('function')

      glBuffer.create('test')

      expect((glBuffer as any).buffers[0].name).to.equal('test')
    })

    it('has method setActive', () => {
      expect(glBuffer.setActive).to.be.a('function')

      const badFn = () => {
        glBuffer.setActive('fail', 0)
      }

      expect(badFn).to.throw()

      glBuffer.create('test')
      glBuffer.setActive('test', 0)

      expect((glBuffer as any).activeBuffer.name).to.equal('test')
    })
  })
})
