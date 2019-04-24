import { expect } from 'chai'

import { State } from '../lib/'

describe('State', () => {
  enum TestState {
    One,
    Two,
    Three
  }
  let state: State<TestState>

  describe('Properties', () => {
    beforeEach(() => {
      state = new State<TestState>(TestState.One)
      state.update(1)
    })

    it('has property time', () => {
      expect(state).to.have.property('time').that.equals(0)
    })

    it('has property first', () => {
      expect(state).to.have.property('first').that.equals(true)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      state = new State<TestState>(TestState.One)
      state.update(1)
    })

    it('has method back', () => {
      expect(state.back).to.be.a('function')

      state.back()
      expect(state.is(TestState.One)).to.equal(true)

      state.set(TestState.Two)
      expect(state.is(TestState.Two)).to.equal(true)

      state.back()
      expect(state.is(TestState.One)).to.equal(true)
    })

    it('has method set', () => {
      expect(state.set).to.be.a('function')

      state.set(TestState.Two)
      expect(state.is(TestState.Two)).to.equal(true)
    })

    it('has method get', () => {
      expect(state.get).to.be.a('function')

      expect(state.get()).to.equal(TestState.One)
    })

    it('has method update', () => {
      expect(state.update).to.be.a('function')

      state.update(1)
      expect(state.first).to.equal(false)
      expect(state.time).to.equal(1)
    })

    it('has method is', () => {
      expect(state.is).to.be.a('function')

      expect(state.is(TestState.Three)).to.equal(false)
    })

    it('has method isIn', () => {
      expect(state.isIn).to.be.a('function')

      expect(state.isIn(TestState.Three)).to.equal(false)
      expect(state.isIn(TestState.Two, TestState.One)).to.equal(true)
    })
  })
})

