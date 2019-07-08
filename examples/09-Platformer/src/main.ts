import { Game, Types } from 'kilo/lib'

import { GameScene } from './scenes/game-scene'

const game = new Game(640, 480)

// Uncomment below line to show FPS & UPS counters
Game.debug = true

game.setScene(new GameScene(game, () => {}))

game.run()
