import { expect } from 'chai'

import { Sound, Game } from '../lib/'

describe('Sound', () => {
  let snd: Sound

  before(() => {
    Game.debug = false
  })

  after(() => {
    Game.debug = true
  })

  it('listens for audio events', () => {
    const end = new Event('ended')
    snd = new Sound('test/sound')

    snd.playing = true
    const anySnd = (<any>snd)

    anySnd.audio.dispatchEvent(end)
    expect(snd.playing).to.equal(false)


    const badFn = () => anySnd.audio.dispatchEvent(new Event('error'))
    badFn()
  })

  describe('Properties', () => {
    beforeEach(() => {
      snd = new Sound('test/sound')
    })

    it('has property playing', () => {
      expect(snd).to.have.property('playing').that.equals(false)

      snd.play()
      expect(snd.playing).to.equal(true)
    })

    it('has property options', () => {
      expect(snd).to.have.property('options')
      const anySnd = (<any>snd)
      expect(anySnd.options.volume).to.equal(1)
      expect(anySnd.options.loop).to.equal(false)
    })
  })

  describe('Accessors', () => {
    beforeEach(() => {
      snd = new Sound('test/sound')
    })

    it('has get accessor volume', () => {
      expect(snd.volume).to.equal(1)
    })

    it('has set accessor volume', () => {
      expect(snd.volume).to.equal(1)

      snd.volume = .5
      expect(snd.volume).to.equal(.5)
    })
  })


  describe('Methods', () => {
    beforeEach(() => {
      snd = new Sound('test/sound')
    })

    it('has method play', () => {
      expect(snd.play).to.be.a('function')
      expect(snd.playing).to.equal(false)

      snd.play()
      expect(snd.playing).to.equal(true)
    })

    it('has method stop', () => {
      expect(snd.stop).to.be.a('function')

      snd.playing = true
      snd.stop()
      expect(snd.playing).to.equal(false)
    })
  })
})

