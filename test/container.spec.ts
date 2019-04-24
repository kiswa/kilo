import { expect } from 'chai'

import { Container } from '../lib/'

describe('Container', () => {
  let cont: Container

  class MockType {
    x: number
    updated = false
    dead = false

    update(dt: number, t: number) {
      this.updated = true
    }
  }

  describe('Methods', () => {
    beforeEach(() => {
      cont = new Container()
    })

    it('has generic method add', () => {
      expect(cont.add).to.be.a('function')

      const t = cont.add<MockType>(new MockType())
      expect(t).to.be.instanceof(MockType)
    })

    it('has generic method remove', () => {
      expect(cont.remove).to.be.a('function')

      const a = new MockType()
      const b = new MockType()

      a.x = 0
      b.x = 1

      cont.add(a)
      cont.add(b)

      expect(cont.children.length).to.equal(2)

      const gone = cont.remove(a)
      expect(cont.children.length).to.equal(1)
      expect(gone).to.equal(a)
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

