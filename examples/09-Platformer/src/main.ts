import { Game, KeyControls } from 'kilo/lib'

import { GameScene } from './scenes/game-scene'

const game = new Game(640, 480)
const controls = {
  keys: new KeyControls()
}

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

game.setScene(new GameScene(game, controls, () => {}))

game.run()
