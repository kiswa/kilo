import { Game, KeyControls } from 'kilo/lib'

import { GameScene } from './scenes/game-scene'
import { GameOverScene } from './scenes/game-over-scene'

/*
 * This is not meant to be a complete game. It is a playable level, with win
 * and loss conditions and environment interactions.
 *
 * The intent of this example is to demonstrate the use of multiple areas of
 * kilo together to create something that feels more like an actual game.
 */

const game = new Game(640, 480)
const controls = {
  keys: new KeyControls()
}

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const setGameScene = () => {
  game.setScene(new GameScene(game, controls, setGameOverScene), 0)
}

const setGameOverScene = () => {
  game.setScene(new GameOverScene(game, controls, setGameScene))
}

setGameScene()
game.run()
