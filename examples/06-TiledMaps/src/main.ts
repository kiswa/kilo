import { Game, TileSprite, Types, Utils } from 'kilo/lib'

import { TiledLevel } from './tiled-map'

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const initGame = (mapData: any) => {
  const tMap = Utils.tiledParser(mapData, ['bg'])
  const map = new TiledLevel(tMap)

  const game = new Game(map.mapWidth * map.tileWidth, map.mapHeight * map.tileHeight)
  const gameMap = game.scene.add<TiledLevel>(map)

  const playerTex = new Types.Texture('assets/images/player.png')
  const player = new TileSprite(playerTex, 40, 55)

  player.pos.set(gameMap.gameObjects.player.x,
    gameMap.gameObjects.player.y - 23)
  player.frame.x = 2

  game.scene.add(player)

  game.run()
}

Game.assets.json('assets/levels/example.json').then(initGame)

