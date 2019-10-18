import { expect } from 'chai'

import { Game, Container } from '../lib'
import { Sprite, Texture, HitBox } from '../lib/types'
import { sprite } from '../lib/utils'

describe('Utils - Sprite', () => {
  let spr: Sprite

  before(() => {
    Game.debug = false
  })

  after(() => {
    Game.debug = true
  })

  beforeEach(() => {
    spr = new Sprite(new Texture(''))

    spr.pos.set(10, 10)
  })

  it('has method addDebug', () => {
    expect(sprite.addDebug).to.be.a('function')

    expect(spr.hasChildren).to.equal(false)
    sprite.addDebug(spr)

    expect(spr.hasChildren).to.equal(true)
    spr.hitBox = null
    sprite.addDebug(spr)
  })

  it('has method angle', () => {
    expect(sprite.angle).to.be.a('function')

    const spr2 = new Sprite(new Texture(''))
    spr2.pos.set(10, 5)

    expect(sprite.angle(spr, spr2)).to.be.closeTo(1, .6)
  })

  it('has method bounds', () => {
    expect(sprite.bounds).to.be.a('function')

    spr.hitBox = null
    const bnds = sprite.bounds(spr)

    expect(bnds.x).to.equal(10)
    expect(bnds.y).to.equal(10)

    spr.hitBox = new HitBox(0, 0, 3, 3)
    const bounds = sprite.bounds(spr)

    expect(bounds.x).to.equal(10)
    expect(bounds.y).to.equal(10)
    expect(bounds.width).to.equal(2)
    expect(bounds.height).to.equal(2)
  })

  it('has method center', () => {
    expect(sprite.center).to.be.a('function')

    const center = sprite.center(spr)

    expect(center.x).to.equal(10)
    expect(center.y).to.equal(10)
  })

  it('has method distance', () => {
    expect(sprite.distance).to.be.a('function')

    const spr2 = new Sprite(new Texture(''))
    spr2.pos.set(10, 15)

    expect(sprite.distance(spr, spr2)).to.equal(5)
  })

  it('has method hit', () => {
    expect(sprite.hit).to.be.a('function')

    spr.width = spr.height = 3
    spr.hitBox = new HitBox(0, 0, 3, 3)

    const spr2 = new Sprite(new Texture(''))
    spr2.width = spr2.height = 3
    spr2.hitBox = new HitBox(0, 0, 3, 3)

    expect(sprite.hit(spr, spr2)).to.equal(false)

    spr2.pos.set(9, 10)
    expect(sprite.hit(spr, spr2)).to.equal(true)
  })

  it('has method hits', done => {
    expect(sprite.hits).to.be.a('function')

    spr.width = spr.height = 3
    spr.hitBox = new HitBox(0, 0, 3, 3)

    const cont = new Container()
    const spr2 = new Sprite(new Texture(''))

    spr2.width = spr2.height = 3
    spr2.hitBox = new HitBox(0, 0, 3, 3)
    spr2.pos.set(9, 10)

    cont.add(spr2)

    sprite.hits(spr, cont, (other: Sprite) => {
      expect(other).to.equal(spr2)
      done()
    })

    spr2.pos.set(0, 0)
    sprite.hits(spr, cont, (other: Sprite) => {
      expect(other).to.equal(spr2)
      done()
    })
  })
})

