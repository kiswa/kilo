import { Game, TileMap, Camera, KeyControls, Types, Utils } from 'kilo/lib'

const game = new Game(320, 240)
const controls = new KeyControls()

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const initGame = (mapData: any) => {
  // Set up extra layers in level with ordering
  const bgLayer: Utils.ExtraLayer = { name: 'bg', isAboveLevel: false }
  const fgLayer: Utils.ExtraLayer = { name: 'fg', isAboveLevel: true }

  // Parse the Tiled export
  const tMap = Utils.tiledParser(mapData, [bgLayer, fgLayer])
  const mapTexture = new Types.Texture('assets/images/level.png')

  // Create a TileMap from the parsed map and texture
  const level = new TileMap(
    tMap.tiles.map(
      (tiles: any) => tiles.map((tile: any) => ({ frame: { ...tile } }))
    ),
    tMap,
    mapTexture
  )

  const worldSize = new Types.Vec(
    (level.mapWidth * level.tileWidth),
    (level.mapHeight * level.tileHeight)
  )

  // The camera needs a target to follow around the world
  // Usually the player, but doesn't have to be (and can change any time)
  const target = new Types.Sprite(new Types.Texture('assets/images/crosshair.png'))
  target.pos.set(worldSize.x / 2, worldSize.y / 2)
  target.height = 64
  target.width = 64

  const cam = new Camera(
    // The target for the camera to follow
    target,
    // Size of the viewport
    <Types.Rect>{ width: game.width, height: game.height },
    // Size of the level
    <Types.Rect>{ width: worldSize.x, height: worldSize.y }
  )
  cam.focus(10)

  // Add the camera to the scene, then add what to show to the camera
  const camera = game.scene.add<Camera>(cam)
  camera.add(level)
  camera.add(target)
  camera.easing = .5 // Default is .3, tweak for your game

  // Uncomment following line to have camera always on target
  // camera.easing = 1

  // Uncomment following line to show the area the camera
  // keeps the target within (unless the camera hits the edge of the level)
  // camera.setDebug()

  let hasFlashed = false
  let hasShaken = false

  game.run((dt: number, t: number) => {
    const { x, y } = controls

    target.pos.x += x * dt * 300
    target.pos.y += y * dt * 300

    // Flash the camera once after two seconds
    if (t > 2 && !hasFlashed) {
      camera.flash(.5) // Half-second flash instead of default .2 seconds
      hasFlashed = true
    }

    // Shake the camera once after 3 seconds
    if (t > 3 && !hasShaken) {
      camera.shake()
      hasShaken = true
    }

    if (target.pos.x < 0) {
      target.pos.x = 0
    }

    if (target.pos.x + target.width > worldSize.x) {
      target.pos.x = worldSize.x - target.width
    }

    if (target.pos.y < 0) {
      target.pos.y = 0
    }

    if (target.pos.y + target.height > worldSize.y) {
      target.pos.y = worldSize.y - target.height
    }
  })
}

Game.assets.json('assets/levels/level.json').then(initGame)

