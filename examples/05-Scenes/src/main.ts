import { Game, Types } from 'kilo/lib'

import { FirstScene } from './scenes/first'
import { SecondScene } from './scenes/second'

const game = new Game(320, 240)

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const loadFirstScene = () => {
  game.setScene(new FirstScene(game, loadSecondScene), 0)
}

const loadSecondScene = () => {
  game.setScene(new SecondScene(game, loadFirstScene), 0)
}

loadFirstScene()

game.run()

