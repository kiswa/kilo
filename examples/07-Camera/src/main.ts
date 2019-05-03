import { Game, TileMap, Types, Utils } from 'kilo/lib'

const game = new Game(320, 240)

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const initGame = (mapData: any) => {
  const bgLayer: Utils.ExtraLayer = { name: 'bg', isAboveLevel: false }
  const fgLayer: Utils.ExtraLayer = { name: 'fg', isAboveLevel: true }

  const tMap = Utils.tiledParser(mapData, [bgLayer, fgLayer])
  const mapTexture = new Types.Texture('assets/images/level.png')

  // const bg = new TileMap(
  //   tMap.tiles[0].map((tile: any) => ({ frame: { ...tile } })),
  //   tMap.mapWidth, tMap.mapHeight,
  //   tMap.tileWidth, tMap.tileHeight,
  //   mapTexture
  // )

  const level = new TileMap(
    tMap.tiles.map((tiles: any) => tiles.map((tile: any) => ({ frame: { ...tile } }))),
    tMap.mapWidth, tMap.mapHeight,
    tMap.tileWidth, tMap.tileHeight,
    mapTexture
  )

  // const fg = new TileMap(
  //   tMap.tiles[2].map((tile: any) => ({ frame: { ...tile } })),
  //   tMap.mapWidth, tMap.mapHeight,
  //   tMap.tileWidth, tMap.tileHeight,
  //   mapTexture
  // )

  // game.scene.add(bg)
  game.scene.add(level)
  // game.scene.add(fg)

  console.log(game.scene)

  game.run()
}

Game.assets.json('assets/levels/level.json').then(initGame)

