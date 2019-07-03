import { expect } from 'chai'

import { Assets, Game } from '../lib/'

; (<any>global).Audio = (<any>window).Audio
; (<any>global).fetch = require('node-fetch')

; (<any>window).HTMLMediaElement.prototype.load = () => {}
; (<any>window).HTMLMediaElement.prototype.play = () => {}
; (<any>window).HTMLMediaElement.prototype.pause = () => {}

describe('Assets', () => {
  const assets = new Assets()

  const con = (<any>window).console
  const olds = [con.log, con.info, con.warn, con.error]

  const disableLog = () => {
    con.log = () => {}
    con.info = () => {}
    con.warn = () => {}
    con.error = () => {}
  }

  const restoreLog = () => {
    con.log = olds[0]
    con.info = olds[1]
    con.warn = olds[2]
    con.error = olds[3]
  }

  before(() => {
    Game.debug = true
  })

  after(() => {
    Game.debug = false
  })

  describe('Accessors', () => {
    it('has get accessor completed', () => {
      expect(assets).to.have.property('completed').that.equals(false)
    })
  })

  describe('Methods', () => {
    const anyAssets = <any>assets

    beforeEach(() => {
      disableLog()
    })

    it('has method onReady', () => {
      expect(assets.onReady).to.be.a('function')

      anyAssets.remaining = 2
      assets.onReady(() => {
        expect(anyAssets.readyListeners.length).to.equal(2)
      })

      anyAssets.onAssetLoad({})
      anyAssets.remaining = 0
      assets.onReady(() => {})

      anyAssets.isCompleted = true
      anyAssets.onAssetLoad({})

      assets.onReady(() => {
        expect(assets.completed).to.equal(true)
      })
      restoreLog()
    })

    it('has method onProgress', () => {
      expect(assets.onProgress).to.be.a('function')

      anyAssets.isCompleted = false

      assets.onProgress((complete, total) => {
        expect(complete).to.equal(1)
        expect(total).to.equal(1)
      })

      anyAssets.total = 1
      anyAssets.remaining = 1
      anyAssets.onAssetLoad({})
      restoreLog()
    })

    it('has method image', () => {
      expect(assets.image).to.be.a('function')
      anyAssets.remaining = 1

      const actual = assets.image('test/image')
      const evt = new Event('load')
      actual.dispatchEvent(evt)
      expect(actual).to.be.instanceOf(HTMLImageElement)

      assets.image('test/image')
      restoreLog()
    })

    it('has method sound', () => {
      expect(assets.sound).to.be.a('function')

      const actual = assets.sound('test/sound')
      const evt = new Event('canplay')
      actual.dispatchEvent(evt)

      expect(actual).to.be.instanceOf(Audio)
      restoreLog()
    })

    it('has method json', () => {
      expect(assets.json).to.be.a('function')

      const actual = assets.json('https://jsonplaceholder.typicode.com/todos/1')
      expect(actual).to.be.instanceOf(Promise)

      assets.json('http://jsonplaceholder.typicode.com/posts/1')
      assets.json('invalidUrl')
      restoreLog()
    })

  })
})

