import { expect } from 'chai'

import { Scene, Game } from '../lib/'

class TestScene extends Scene {}

describe('Scene', () => {
  let scene: Scene

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

  disableLog()
  const game = new Game(32, 32)
  restoreLog()

  describe('Properties', () => {
    beforeEach(() => {
      scene = new TestScene(game, () => true)
    })

    it('has property game', () => {
      expect(scene.game).to.equal(game)
    })

    it('has property controls', () => {
      expect(scene.controls).to.be.undefined
    })

    it('has property onSceneComplete', () => {
      expect(scene.onSceneComplete).to.be.a('function')
      expect(scene.onSceneComplete()).to.be.true
    })
  })
})

