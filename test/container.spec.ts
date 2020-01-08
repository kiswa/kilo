import { expect } from 'chai'

import { Container } from '../lib/'

describe('Container', () => {
  let cont: Container

  class MockType {
    x: number
    updated = false
    dead = false

    update(_: number, __: number) {
      this.updated = true
    }
  }

  describe('Methods', () => {
    beforeEach(() => {
      cont = new Container()
    })

    it('has method update', () => {
      expect(cont.update).to.be.a('function')

      const a = new MockType()
      const b = new MockType()

      a.x = 0
      b.x = 1

      cont.add(a)
      cont.add(b)

      expect(cont.children.length).to.equal(2)

      cont.update(1, 1)
      expect(a.updated).to.equal(true)

      a.dead = true
      cont.update(1, 1)
      expect(cont.children.length).to.equal(1)
    })
  })
})

