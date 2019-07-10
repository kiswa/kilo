import { expect } from 'chai'

import { Sound, SoundGroup, Game } from '../lib/'

describe('SoundGroup', () => {
  let snds: SoundGroup

  before(() => {
    Game.debug = false
  })

  after(() => {
    Game.debug = true
  })

  describe('Methods', () => {
    beforeEach(() => {
      snds = new SoundGroup([
        new Sound('test/sound1'),
        new Sound('test/sound2')
      ])
    })

    it('has method play', () => {
      expect(snds.play).to.be.a('function')

      snds.play()
      const sndsPlaying = (snds as any).sounds
        .filter((snd: Sound) => snd.playing).length

      expect(sndsPlaying).to.equal(1)
    })

    it('has method stop', () => {
      expect(snds.stop).to.be.a('function')

      ; (snds as any).sounds
        .forEach((snd: Sound) => { snd.playing = true })

      snds.stop()
      const sndsPlaying = (snds as any).sounds
        .filter((snd: Sound) => snd.playing).length

      expect(sndsPlaying).to.equal(0)
    })
  })

})

