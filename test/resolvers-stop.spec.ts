import { expect } from 'chai'

import { Resolvers } from '../lib/'

describe('Resolvers - Stop Movement', () => {
  const ent: any = {
    pos: { x: 0, y: 0 },
    width: 1,
    height: 1
  }

  const map: any = {
    tilesAtCorners: (_: any, __: number, ___: number): any[] => {
      return [
        { frame: { walkable: true } },
        { frame: { walkable: false } },
      ]
    }
  }

  it('is a function', () => {
    expect(Resolvers.wallSlide).to.be.a('function')
  })

  it('stops all movement to resolve collision', () => {
    const actual = Resolvers.stopMovement(ent, map)

    expect(actual).to.have.property('x').that.equals(0)
    expect(actual).to.have.property('y').that.equals(0)
  })

  it('returns original values when no collision', () => {
    map.tilesAtCorners = (_: any, __: number, ___: number): any[] => {
      return [
        { frame: { walkable: true } },
      ]
    }

    const actual = Resolvers.stopMovement(ent, map, 1, 1)

    expect(actual).to.have.property('x').that.equals(1)
    expect(actual).to.have.property('y').that.equals(1)
  })
})

