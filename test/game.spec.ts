import { expect } from 'chai'

import { Game, Container, Scene } from '../lib/'

require('jsdom-global')('', { pretendToBeVisual: true })

describe('Game', () => {
  let game: Game

  const con = (window as any).console
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

  const orig = document.createElement

  before(() => {
    const gl = require('gl')(640, 480)
    //
    // Provide webgl context to canvas for tests
    ; (document.createElement as any) = (el: string) => {
      if (el === 'canvas') {
        const newEl = orig.call(document, el)

        ; (newEl as any).getContext = (ctx: string) => {
          if (ctx === 'webgl') {
            return gl
          }

          return orig.call(document, 'canvas').getContext(ctx)
        }

        return newEl
      }

      return orig.call(document, el)
    }
  })

  describe('Properties', () => {
    it('has static property FPS with default value', () => {
      expect(Game).to.have.property('FPS').that.equals(60)
    })

    it('has static property UPS with default value', () => {
      expect(Game).to.have.property('UPS').that.equals(60)
    })

    it('has static property assets with default value', () => {
      expect(Game).to.have.property('assets').that.is.an('object')
    })

    it('has static property debug with default value', () => {
      expect(Game).to.have.property('debug').that.equals(false)
    })
  })

  describe('Accessors', () => {
    beforeEach(() => {
      disableLog()
      game = new Game(640, 480)
      restoreLog()
    })

    it('has get accessor width', () => {
      expect(game.width).to.equal(640)
    })

    it('has get accessor height', () => {
      expect(game.height).to.equal(480)
    })

    it('has get accessor speed', () => {
      expect(game.speed).to.equal(1)
    })

    it('has set accessor speed', () => {
      expect(game.speed).to.equal(1)
      game.speed = 2
      expect(game.speed).to.equal(2)
    })

    it('has get accessor scene', () => {
      expect(game.scene).to.be.instanceof(Container)
    })

    it('has get accessor canvas', () => {
      expect(game.canvas).to.be.instanceof(HTMLCanvasElement)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      disableLog()
      game = new Game(640, 480, false)
      restoreLog()
    })

    it('has method run', done => {
      game = new Game(640, 480)
      expect(game.run).to.be.a('function')

      Game.debug = true

      game.run((dt: number, t: number) => {
        expect(dt).to.be.above(0)
        expect(t).to.be.above(0)
      })

      setTimeout(() => {
        done()
      }, 1000)
    })

    it('has method setScene', () => {
      expect(game.setScene).to.be.a('function')

      class MyScene extends Scene {
      }

      const scene = new MyScene(game, () => {})

      game.setScene(scene)
      game.setScene(scene, 0)
      game.run()
    })
  })

})

