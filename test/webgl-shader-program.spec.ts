import { expect } from 'chai'

import { ShaderProgram } from '../lib/renderer/webgl/shader-program'

describe('ShaderProgram', () => {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl')

  let prog: ShaderProgram

  describe('Accessors', () => {
    beforeEach(() => {
      prog = new ShaderProgram(gl, { vertex: '', fragment: '' })
    })

    it('has get accessor program', () => {
      expect(prog).to.have.property('program')
      expect(prog.program).to.be.an('object')
    })
  })
})

