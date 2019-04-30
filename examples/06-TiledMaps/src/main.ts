import { Game, Types, Utils } from 'kilo/lib'

import { TiledLevel } from './tiled-map'

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

let game: Game
let gameMap: TiledLevel

const initGame = (mapData: any) => {
  const tMap = Utils.tiledParser(mapData, ['bg'])
  const map = new TiledLevel(tMap)

  game = new Game(map.mapWidth * map.tileWidth, map.mapHeight * map.tileHeight)
  gameMap = game.scene.add<TiledLevel>(map)

  game.run()
}

Game.assets.json('assets/levels/example.json').then(initGame)

