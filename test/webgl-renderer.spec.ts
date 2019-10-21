import { expect } from 'chai'

import { Container } from '../lib'
import { WebGLRenderer } from '../lib/renderer/webgl-renderer'

describe('WebGLRenderer', () => {
  const orig = document.createElement
  const gl = require('gl')(320, 240)

  ; (document.createElement as any) = (el: string) => {
    if (el === 'canvas') {
      const newEl = orig.call(document, el)

      ; (newEl as any).getContext = () => gl

      return newEl
    }

    return orig.call(document, el)
  }

  const glRenderer = new WebGLRenderer(320, 240, document.body)

  describe('Methods', () => {
    it('has method render', () => {
      expect(glRenderer).to.be.instanceof(WebGLRenderer)
      expect(glRenderer).to.have.property('render').that.is.a('function')
    })

    describe('render', () => {
      let container: any

      const renderTiming = () => {
        const start = window.performance.now()
        glRenderer.render(container)
        const end = window.performance.now()

        return end - start
      }

      beforeEach(() => {
        container = new Container()
      })

      it('exits early if nothing is visible', () => {
        container.visible = false

        expect(renderTiming()).to.be.below(1)
      })
    })
  })
})

