import { expect } from 'chai'

import { Entity, Vec } from '../lib/types'

class TestEntity extends Entity {
  constructor() {
    super()
  }

  update(_: number, __: number): void {
    this.visible = false
  }
}

describe('Entity', () => {
  let entity: TestEntity

  class MockType {
    x: number
    updated = false
    dead = false

    update(_: number, __: number) {
      this.updated = true
    }
  }


  describe('Properties', () => {
    beforeEach(() => {
      entity = new TestEntity()
    })

    it('has property visible', () => {
      expect(entity).to.have.property('visible').that.equals(true)
    })

    it('has property dead', () => {
      expect(entity).to.have.property('dead').that.equals(false)
    })

    it('has property alpha', () => {
      expect(entity).to.have.property('alpha').that.equals(1)
    })

    it('has property pos', () => {
      expect(entity).to.have.property('pos').that.is.instanceof(Vec)

      expect(entity.pos.x).to.equal(0)
      expect(entity.pos.y).to.equal(0)
    })

    it('has property scale', () => {
      expect(entity).to.have.property('scale').that.is.instanceof(Vec)

      expect(entity.scale.x).to.equal(1)
      expect(entity.scale.y).to.equal(1)
    })

    it('has property children', () => {
      expect(entity).to.have.property('children').that.is.instanceof(Array)

      expect(entity.children.length).to.equal(0)
    })
  })

  describe('Accessors', () => {
    it('has get accessor hasChildren', () => {
      const ent = new TestEntity()

      expect(ent).to.have.property('hasChildren')
      expect(ent.hasChildren).to.equal(false)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      entity = new TestEntity()
    })

    it('has generic method add', () => {
      expect(entity.add).to.be.a('function')

      const t = entity.add<MockType>(new MockType())
      expect(t).to.be.instanceof(MockType)
    })

    it('has generic method remove', () => {
      expect(entity.remove).to.be.a('function')

      const a = new MockType()
      const b = new MockType()

      a.x = 0
      b.x = 1

      entity.add(a)
      entity.add(b)

      expect(entity.children.length).to.equal(2)

      const gone = entity.remove(a)
      expect(entity.children.length).to.equal(1)
      expect(gone).to.equal(a)
    })

    it('has method update', () => {
      expect(entity.update).to.be.a('function')

      entity.update(0, 0)

      expect(entity.visible).to.equal(false)
    })

    it('has method map', () => {
      expect(entity.map).to.be.a('function')

      entity.children.push(new TestEntity())

      const result = entity.map((child) => {
        child.dead = true

        return child
      })

      expect(result[0].dead).to.equal(true)
    })
  })
})

