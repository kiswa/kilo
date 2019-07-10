import { expect } from 'chai'

import { Resolvers } from '../lib/'

describe('Resolvers - Wall Slide', () => {
  const ent: any = {
    pos: { x: 0, y: 0 },
    width: 1,
    height: 1
  }

  const map: any = {
    tilesAtCorners: (_: any, __: number, ___: number): any[] => {
      return [
        { pos: { x: 0, y: 0 }, frame: { walkable: false } },
        { pos: { x: 0, y: 0 }, frame: { walkable: false } },
        { pos: { x: 0, y: 0 }, frame: { walkable: false } },
        { pos: { x: 0, y: 0 }, frame: { walkable: false } },
      ]
    }
  }

  it('is a function', () => {
    expect(Resolvers.wallSlide).to.be.a('function')

    let actual = Resolvers.wallSlide(ent, map)

    expect(actual.x).to.equal(0)
    expect(actual.y).to.equal(0)

    Object.keys(actual.hits).forEach(key => {
      expect(actual.hits[key]).to.equal(false)
    })

    actual = Resolvers.wallSlide(ent, map, 1, 1)
    expect(actual.x).to.equal(-1)
    expect(actual.y).to.equal(-1)
  })

  it('offsets y movement to resolve collision', () => {
    let actual = Resolvers.wallSlide(ent, map, 0, 1, () => false)
    expect(actual.hits.down).to.equal(true)

    actual = Resolvers.wallSlide(ent, map, 0, -1, () => false)
    expect(actual.hits.up).to.equal(true)
  })

  it('offsets x movement to resolve collision', () => {
    let actual = Resolvers.wallSlide(ent, map, 1, 0, () => false)
    expect(actual.hits.right).to.equal(true)

    actual = Resolvers.wallSlide(ent, map, -1, 0, () => false)
    expect(actual.hits.left).to.equal(true)
  })

  it('resolves nothing when in walkable space', () => {
    let actual = Resolvers.wallSlide(ent, map, 1, 1, () => true)

    Object.keys(actual.hits).forEach(key => {
      expect(actual.hits[key]).to.equal(false)
    })

    actual = Resolvers.wallSlide(ent, map, -1, -1, () => true)

    Object.keys(actual.hits).forEach(key => {
      expect(actual.hits[key]).to.equal(false)
    })
  })
})

