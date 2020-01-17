import {
  Camera,
  Container,
  Controls,
  FX,
  Game,
  Scene,
  TileSprite,
  Timer,
  Types,
  Utils,
} from 'kilo/lib'

import { TiledLevel } from '../tiled-level'
import { Player } from '../entities/player'

export class GameScene extends Scene {
  private camera: Camera
  private player: Player
  private level: TiledLevel

  private pickups: Container
  private key: TileSprite
  private tileSheet: Types.Texture

  private collectedPickups: number
  private loaded: boolean
  private gameWon: boolean

  private emitter: FX.ParticleEmitter

  constructor(game: Game, controls: Controls, onComplete: Function) {
    super(game, onComplete, controls)

    const extraLayers = [
      { name: 'bg', isAboveLevel: false },
      { name: 'fg', isAboveLevel: true }
    ]

    this.collectedPickups = 0
    this.tileSheet = new Types.Texture('assets/images/tilesheet.png')

    Game.assets.json('assets/levels/example.json').then((mapData: any) => {
      const tMap = Utils.tiledParser(mapData, extraLayers)

      this.setupCamera(tMap, game)

      for (let i = 0; i < 3; ++i) {
        const placeholder = this.add(new TileSprite(this.tileSheet, 32, 32))

        placeholder.frame.set(6, 2)
        placeholder.pos.set(16 * i, 0)
      }

      this.loaded = true
    })
  }

  update(dt: number, t: number) {
    if (!this.loaded) {
      return
    }

    super.update(dt, t)

    if (this.controls.keys.key('KeyP')) {
      this.emitter.play(new Types.Vec(this.player.pos.x + 16, this.player.pos.y))
    }

    Utils.sprite.hits(this.player, this.pickups, (pickup: TileSprite) => {
      const isBottomHit = this.resolvePlayerPosition(pickup)

      if (!isBottomHit || (pickup as any).done) {
        return
      }

      (pickup as any).done = true
      pickup.frame.set(4, 3)

      this.displayPickup(pickup)
    })

    this.updateKey(t)

    if (this.key.visible && !this.key.dead &&
        Utils.sprite.hit(this.player, this.key)) {
      this.key.dead = true

      const key = new TileSprite(this.tileSheet, 32, 32)
      key.frame.set(8, 4)

      const one = this.camera.add<FX.OneUp>(new FX.OneUp(key))
      one.pos.set(this.player.pos.x, this.player.pos.y - 16)

      this.player.addKey()
    }

    const exit = this.level.gameObjects.exit

    if (this.player.hasKey &&
        this.player.pos.x + this.player.width >= exit.x &&
        this.player.pos.y >= exit.y) {
      this.youWin(exit)
    }

    if (this.gameWon) {
      this.emitter.play(this.emitter.pos)
    }
  }

  private youWin(exit: Tiled.Object) {
    const doorTop = this.level.tileAtPixelPos(exit as any)
    exit.y += exit.height
    const doorBottom = this.level.tileAtPixelPos(exit as any)

    doorTop.frame.x = 5
    doorTop.frame.y = 5

    doorBottom.frame.x = 5
    doorBottom.frame.y = 6

    this.player.paused = true
    this.player.visible = false

    const winner = new Types.Text('Winner!', {
      font: '50px monospace',
      fill: '#333',
      align: 'center'
    })
    winner.pos.set(this.player.pos.x - 220, this.game.height / 2 - 40)
    this.emitter.pos.copy(winner.pos)

    this.camera.add(winner)
    this.gameWon = true
  }

  private updateKey(t: number) {
    if (this.collectedPickups !== this.pickups.children.length) {
      return
    }

    this.key.visible = true
    this.key.pos.y += Math.sin(5 * t) * .1

    if ((this.key as any).done) {
      return
    }

    (this.key as any).done = true
    this.camera.setSubject(this.key)
    this.player.paused = true

    this.add(new Timer(() => {}, () => {
      this.camera.setSubject(this.player)
      this.player.paused = false
    }, 2, 0))
  }

  private displayPickup(pickup: TileSprite) {
    this.collectedPickups++

    const oneUp = this.camera.add<FX.OneUp>(new FX.OneUp(this.createDiamond()))
    oneUp.pos.set(pickup.pos.x, pickup.pos.y - 16)

    const captured = this.createDiamond()
    captured.pos.set(16 * (this.collectedPickups - 1), 0)
    this.add(captured)

    this.camera.shake(2, .2)
  }

  private resolvePlayerPosition(pickup: TileSprite) {
    const box = Utils.sprite.bounds(this.player)

    const playerRightOverPickupLeft = box.x + box.width > pickup.pos.x
    const playerRightOverPickupRight = box.x + box.width < pickup.pos.x + pickup.width
    const playerLeftOverPickupLeft = box.x > pickup.pos.x
    const playerLeftOverPickupRight = box.x < pickup.pos.x + pickup.width

    const playerTopOverPickupTop = box.y < pickup.pos.y
    const playerTopOverPickupBottom = box.y < pickup.pos.y + pickup.height
    const playerBottomOverPickupTop = box.y + box.height > pickup.pos.y
    const playerBottomOverPickupBottom = box.y + box.height < pickup.pos.y + pickup.height

    if (playerTopOverPickupBottom && !playerBottomOverPickupBottom) {
      this.player.pos.y += pickup.pos.y + pickup.height - box.y
      this.player.vel.y = 0
    }

    if (playerBottomOverPickupTop && playerTopOverPickupTop) {
      this.player.pos.y -= box.y + box.height - pickup.pos.y
      this.player.falling = false
      this.player.vel.y = 0
    }

    if (playerRightOverPickupLeft && playerLeftOverPickupLeft &&
        !playerTopOverPickupBottom) {
      this.player.pos.x += pickup.pos.x + pickup.width - box.x
      this.player.vel.x = 0
    }

    if (playerLeftOverPickupRight && playerRightOverPickupRight &&
        !playerTopOverPickupBottom) {
      this.player.pos.x -=  box.x + box.width - pickup.pos.x
      this.player.vel.x = 0
    }

    return playerTopOverPickupBottom && !playerBottomOverPickupBottom
  }

  private setupCamera(tMap: Utils.TiledMap, game: Game) {
    this.level = new TiledLevel(tMap)
    const worldSize = new Types.Vec(
      (this.level.mapWidth * this.level.tileWidth),
      (this.level.mapHeight * this.level.tileHeight)
    )

    const player = new Player(this.controls.keys, this.level)
    const spawn = this.level.gameObjects.player
    player.pos.set(spawn.x, spawn.y - 31)

    const cam = new Camera(player,
      new Types.Rect(game.width, game.height),
      new Types.Rect(worldSize.x, worldSize.y)
    )

    player.onDeath = () => {
      this.camera.flash()
      this.camera.shake()
      this.onSceneComplete()
    }

    this.camera = this.add<Camera>(cam)

    for (const layer of this.level.layersUpToLevel) {
      this.camera.add(layer)
    }

    this.pickups = new Container()

    const pickups = tMap.getObjectsByType('pickup')
    pickups.forEach(pickup => {
      const sprite = new TileSprite(this.tileSheet, 32, 32)
      sprite.pos.set(pickup.x, pickup.y)
      sprite.frame.set(3, 2)

      this.pickups.add(this.camera.add<TileSprite>(sprite))
    })

    this.player = this.camera.add<Player>(player)

    const key = new TileSprite(this.tileSheet, 32, 32)
    key.frame.set(8, 4)
    key.pos.set(key.width * 13, key.height * 7 - 8)
    key.visible = false

    this.key = this.camera.add<TileSprite>(key)

    for (const layer of this.level.layersAboveLevel) {
      this.camera.add(layer)
    }

    this.emitter = this.camera.add(new FX.ParticleEmitter(30, this.createDiamond()))
    // Uncomment below to see the camera bounds
    // this.camera.setDebug()
  }

  private createDiamond() {
    const diamond = new TileSprite(this.tileSheet, 32, 32)
    diamond.frame.set(8, 2)

    return diamond
  }
}

