import { Game, TileSprite, Types, Utils } from 'kilo/lib'

import { TiledLevel } from './tiled-map'

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const initGame = (mapData: any) => {
  // Set up extra layer in level tiles
  const extraLayer: Utils.ExtraLayer = { name: 'bg', isAboveLevel: false }

  // Parse the map data and create an instance of the custom level
  const tMap = Utils.tiledParser(mapData, [extraLayer])
  const map = new TiledLevel(tMap)

  const game = new Game(map.mapWidth * map.tileWidth, map.mapHeight * map.tileHeight)
  const gameMap = game.scene.add<TiledLevel>(map)

  const playerTex = new Types.Texture('assets/images/player.png')
  const player = new TileSprite(playerTex, 40, 55)

  // Set player position from level entities layer data
  player.pos.set(gameMap.gameObjects.player.x,
    gameMap.gameObjects.player.y - 23)
  player.frame.x = 2

  game.scene.add(player)

  const tilesTex = new Types.Texture('assets/images/tiles.png')

  // Add the 'pickups' game objects from entities layer data
  gameMap.gameObjects.pickups.forEach((pickup: any) => {
    const sprite = new TileSprite(tilesTex, pickup.width, pickup.height)

    sprite.frame.set(28, 2)
    sprite.pos.set(pickup.x, pickup.y)

    game.scene.add(sprite)
  })

  game.run()
}

Game.assets.json('assets/levels/example.json').then(initGame)

