import { Game, TileMap, Camera, KeyControls, Types, Utils } from 'kilo/lib'

const game = new Game(320, 240)
const controls = new KeyControls()

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const initGame = (mapData: any) => {
  const bgLayer: Utils.ExtraLayer = { name: 'bg', isAboveLevel: false }
  const fgLayer: Utils.ExtraLayer = { name: 'fg', isAboveLevel: true }

  const tMap = Utils.tiledParser(mapData, [bgLayer, fgLayer])
  const mapTexture = new Types.Texture('assets/images/level.png')

  const level = new TileMap(
    tMap.tiles.map((tiles: any) => tiles.map((tile: any) => ({ frame: { ...tile } }))),
    tMap.mapWidth, tMap.mapHeight,
    tMap.tileWidth, tMap.tileHeight,
    mapTexture
  )

  const worldSize = new Types.Vec(
    (level.mapWidth * level.tileWidth),
    (level.mapHeight * level.tileHeight)
  )

  const invisiblePlayer = new Types.Sprite(null)
  invisiblePlayer.pos.set(worldSize.x / 2, worldSize.y / 2)

  const cam = new Camera(
    // The target for the camera to follow
    invisiblePlayer,
    // Size of the viewport
    <Types.Rect>{ width: game.width, height: game.height },
    // Size of the level
    <Types.Rect>{ width: worldSize.x, height: worldSize.y }
  )

  const camera = game.scene.add<Camera>(cam)
  camera.add(level)
  camera.add(invisiblePlayer)

  // Uncomment following line to have camera always on target
  // camera.easing = 1 // 0 = stationary camera, 1 = no easing

  // Uncomment following line to show the area the camera
  // keeps the target within (unless the camera hits the edge of the level)
  // camera.setDebug()

  game.run((dt: number, t: number) => {
    const { x, y } = controls

    invisiblePlayer.pos.x += x * dt * 300
    invisiblePlayer.pos.y += y * dt * 300

    if (invisiblePlayer.pos.x < 0) {
      invisiblePlayer.pos.x = 0
    }

    if (invisiblePlayer.pos.x > worldSize.x) {
      invisiblePlayer.pos.x = worldSize.x
    }

    if (invisiblePlayer.pos.y < 0) {
      invisiblePlayer.pos.y = 0
    }

    if (invisiblePlayer.pos.y > worldSize.y) {
      invisiblePlayer.pos.y = worldSize.y
    }

    console.log(invisiblePlayer.pos, worldSize)
  })
}

Game.assets.json('assets/levels/level.json').then(initGame)

