import { Camera, Controls, Game, Scene, Speed, Types, Utils } from 'kilo/lib'

import { TiledLevel } from '../tiled-level'
import { Player } from '../entities/player'

export class GameScene extends Scene {
  private camera: Camera

  constructor(game: Game, controls: Controls, onComplete: Function) {
    super(game, onComplete, controls)

    game.speed = Speed.Slow

    const extraLayer = { name: 'bg', isAboveLevel: false }

    Game.assets.json('assets/levels/example.json').then((mapData: any) => {
      const tMap = Utils.tiledParser(mapData, [extraLayer])

      this.setupCamera(tMap, game)
    })
  }

  private setupCamera(tMap: Utils.TiledMap, game: Game) {
      const level = new TiledLevel(tMap)
      const worldSize = new Types.Vec(
        (level.mapWidth * level.tileWidth),
        (level.mapHeight * level.tileHeight)
      )

      const player = new Player(this.controls.keys, level)
      const spawn = tMap.getObjectByName('spawn')
      player.pos.set(spawn.x, spawn.y - 32)

      const cam = new Camera(player,
        new Types.Rect(game.width, game.height),
        new Types.Rect(worldSize.x, worldSize.y)
      )

      this.camera = this.add<Camera>(cam)

      this.camera.add<TiledLevel>(level)
      this.camera.add(player)
  }
}

