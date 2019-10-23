import { expect } from 'chai'

import { ShaderProgram } from '../lib/renderer/webgl/shader-program'

describe('ShaderProgram', () => {
  const gl = require('gl')(320, 240)
  let prog: ShaderProgram

  const fns = {
    shInfo: gl.getShaderInfoLog,
    shParam: gl.getShaderParameter,
    progInfo: gl.getProgramInfoLog,
    progPara: gl.getProgramParameter,
    getAttrib: gl.getActiveAttrib,
    getUniform: gl.getActiveUniform,
    getAtLoc: gl.getAttribLocation,
    getUnLoc: gl.getUniformLocation
  }

  const failShaders = () => {
    gl.getShaderParameter = () => null
    gl.getShaderInfoLog = () => 'test error'
  }

  const failProgram = () => {
    gl.getProgramParameter = () => null
    gl.getProgramInfoLog = () => 'prog error'
  }

  const restoreFns = () => {
    gl.getShaderInfoLog = fns.shInfo
    gl.getShaderParameter = fns.shParam

    gl.getProgramInfoLog = fns.progInfo
    gl.getProgramParameter = fns.progPara

    gl.getActiveAttrib = fns.getAttrib
    gl.getActiveUniform = fns.getUniform

    gl.getAttribLocation = fns.getAtLoc
    gl.getUniformLocation = fns.getUnLoc
  }

  beforeEach(() => {
    prog = new ShaderProgram(gl, {
      vertex: `void main() {}`,
      fragment: `void main() {}`
    }, 'test')
  })

  it('throws if a shader is invalid', () => {
    failShaders()

    const badFn = () => {
      prog = new ShaderProgram(gl, {
        vertex: `void main() {}`,
        fragment: `void main() {}`
      })
    }

    expect(badFn).to.throw('test error')

    restoreFns()
  })

  it('throws if the program fails to link', () => {
    failProgram()

    const badFn = () => {
      prog = new ShaderProgram(gl, {
        vertex: `void main() {}`,
        fragment: `void main() {}`
      })
    }

    expect(badFn).to.throw('prog error')

    restoreFns()
  })

  describe('Accessors', () => {
    it('has get accessor program', () => {
      expect(prog).to.have.property('program')
      expect(prog.program).to.be.an('object')
    })
  })

  describe('Methods', () => {
    it('has method getAttribLocation', function() {
      this.retries(2)
      expect(prog).to.have.property('getAttribLocation').that.is.a('function')

      const badFn = () => prog.getAttribLocation('bad')
      expect(badFn).to.throw('Unknown attribute bad in shader program test.')

      gl.getProgramParameter = () => 100
      gl.getActiveAttrib = () => Math.random() < .1 ? null : { name: 'test' }
      gl.getAttribLocation = () => 0

      prog = new ShaderProgram(gl, {
        vertex: `void main() {}`,
        fragment: `void main() {}`
      })

      expect(prog.getAttribLocation('test')).to.equal(0)

      restoreFns()
    })

    it('has method getUniformLocation', function() {
      this.retries(2)
      expect(prog).to.have.property('getUniformLocation').that.is.a('function')

      const badFn = () => prog.getUniformLocation('bad')
      expect(badFn).to.throw('Unknown uniform bad in shader program test.')

      gl.getProgramParameter = () => 100
      gl.getActiveUniform = () => Math.random() < .1 ? null : { name: 'test' }
      gl.getUniformLocation = () => 0

      prog = new ShaderProgram(gl, {
        vertex: `void main() {}`,
        fragment: `void main() {}`
      })

      expect(prog.getUniformLocation('test')).to.equal(0)

      restoreFns()
    })
  })
})

