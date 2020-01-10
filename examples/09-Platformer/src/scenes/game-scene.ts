import {
  Camera,
  Container,
  Controls,
  Game,
  Resolvers,
  Scene,
  TileSprite,
  Types,
  Utils,
  FX,
} from 'kilo/lib'

import { TiledLevel } from '../tiled-level'
import { Player } from '../entities/player'

export class GameScene extends Scene {
  private camera: Camera
  private player: Player
  private pickups: Container
  private diamond: TileSprite

  constructor(game: Game, controls: Controls, onComplete: Function) {
    super(game, onComplete, controls)

    const extraLayers = [
      { name: 'bg', isAboveLevel: false },
      { name: 'fg', isAboveLevel: true }
    ]

    this.diamond = new TileSprite(
      new Types.Texture('assets/images/tilesheet.png'), 32, 32)
    this.diamond.frame.set(8, 2)

    Game.assets.json('assets/levels/example.json').then((mapData: any) => {
      const tMap = Utils.tiledParser(mapData, extraLayers)

      this.setupCamera(tMap, game)
    })
  }

  update(dt: number, t: number) {
    super.update(dt, t)

    Utils.sprite.hits(this.player, this.pickups, (pickup: TileSprite) => {
      this.resolvePlayerPosition(pickup)

      if ((pickup as any).done) {
        return
      }

      (pickup as any).done = true
      pickup.frame.set(4, 3)

      const one = this.camera.add<FX.OneUp>(new FX.OneUp(this.diamond))
      one.pos.set(pickup.pos.x, pickup.pos.y - 16)
    })
  }

  private resolvePlayerPosition(pickup: TileSprite) {
    this.player.vel.set(0, 0)
    const box = Utils.sprite.bounds(this.player)

    if (box.x + box.width > pickup.pos.x) {
      this.player.pos.x = pickup.pos.x - this.player.width
    }
  }

  private setupCamera(tMap: Utils.TiledMap, game: Game) {
    const level = new TiledLevel(tMap)
    const worldSize = new Types.Vec(
      (level.mapWidth * level.tileWidth),
      (level.mapHeight * level.tileHeight)
    )

    const player = new Player(this.controls.keys, level)
    const spawn = tMap.getObjectByName('spawn')
    player.pos.set(spawn.x, spawn.y - 31)

    const cam = new Camera(player,
      new Types.Rect(game.width, game.height),
      new Types.Rect(worldSize.x, worldSize.y)
    )

    player.onDeath = () => {
      this.camera.flash()
      this.camera.shake()
    }

    this.camera = this.add<Camera>(cam)

    for (const layer of level.layersUpToLevel) {
      this.camera.add(layer)
    }

    this.pickups = new Container()

    const pickups = tMap.getObjectsByType('pickup')
    pickups.forEach(pickup => {
      const sprite =
        new TileSprite(new Types.Texture('assets/images/tilesheet.png'), 32, 32)
      sprite.pos.set(pickup.x, pickup.y)
      sprite.frame.set(3, 2)

      this.pickups.add(this.camera.add<TileSprite>(sprite))
    })

    this.player = this.camera.add<Player>(player)

    for (const layer of level.layersAboveLevel) {
      this.camera.add(layer)
    }

    // Uncomment below to see the camera bounds
    // this.camera.setDebug()
  }
}

