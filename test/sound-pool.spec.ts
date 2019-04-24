import { expect } from 'chai'

import { SoundPool, Game } from '../lib/'

describe('SoundPool', () => {
  let snds: SoundPool

  before(() => {
    Game.debug = false
  })

  after(() => {
    Game.debug = true
  })

  describe('Methods', () => {
    beforeEach(() => {
      snds = new SoundPool('test/sound')
    })

    it('has method play', () => {
      expect(snds.play).to.be.a('function')

      const anySnds = (<any>snds)
      snds.play()
      snds.play()

      expect(anySnds.sounds[0].playing).to.equal(true)
      expect(anySnds.sounds[1].playing).to.equal(true)
    })

    it('has method stop', () => {
      expect(snds.stop).to.be.a('function')

      const anySnds = (<any>snds)
      snds.play()
      snds.play()

      expect(anySnds.sounds[0].playing).to.equal(true)
      expect(anySnds.sounds[1].playing).to.equal(true)

      snds.stop()

      expect(anySnds.sounds[0].playing).to.equal(false)
      expect(anySnds.sounds[1].playing).to.equal(false)
    })
  })

})

