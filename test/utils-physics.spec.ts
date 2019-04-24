import { expect } from 'chai'

import { physics } from '../lib/utils'
import { Vec } from '../lib/types'

describe('Utils - Physics', () => {
  let vecEnt

  beforeEach(() => {
    vecEnt = {
      acc: new Vec(),
      vel: new Vec(),
      pos: new Vec(),
      mass: 1
    }
  })

  it('has method applyForce', () => {
    expect(physics.applyForce).to.be.a('function')

    physics.applyForce(vecEnt, new Vec(1, 1))

    expect(vecEnt.acc.x).to.equal(1)
    expect(vecEnt.acc.y).to.equal(1)
  })

  it('has method applyFriction', () => {
    expect(physics.applyFriction).to.be.a('function')

    vecEnt.acc.set(1, 1)
    physics.applyFriction(vecEnt, 2)

    expect(vecEnt.acc.x).to.equal(1)
    expect(vecEnt.acc.y).to.equal(1)
  })

  it('has method applyHorizontalFriction', () => {
    expect(physics.applyHorizontalFriction).to.be.a('function')

    vecEnt.acc.set(1, 1)
    physics.applyHorizontalFriction(vecEnt, 2)

    expect(vecEnt.acc.x).to.equal(1)
    expect(vecEnt.acc.y).to.equal(1)
  })

  it('has method applyImpulse', () => {
    expect(physics.applyImpulse).to.be.a('function')

    vecEnt.acc.set(1, 1)
    physics.applyImpulse(vecEnt, new Vec(1, 1), .5)

    expect(vecEnt.acc.x).to.equal(3)
    expect(vecEnt.acc.y).to.equal(3)
  })

  it('has method integrate', () => {
    expect(physics.integrate).to.be.a('function')

    vecEnt.acc.set(1, 1)
    physics.integrate(vecEnt, .5)

    expect(vecEnt.acc.x).to.equal(0)
    expect(vecEnt.acc.y).to.equal(0)
    expect(vecEnt.vel.x).to.equal(.5)
    expect(vecEnt.vel.y).to.equal(.5)
  })

  it('has method integratePos', () => {
    expect(physics.integratePos).to.be.a('function')

    vecEnt.acc.set(1, 1)
    physics.integratePos(vecEnt, .5)

    expect(vecEnt.pos.x).to.equal(.125)
    expect(vecEnt.pos.y).to.equal(.125)
  })

  it('has method speed', () => {
    expect(physics.speed).to.be.a('function')

    const speed = physics.speed(new Vec(1, 1))

    expect(speed).to.equal(Math.sqrt(2))
  })
})

