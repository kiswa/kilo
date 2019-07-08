import { Game, Camera, Scene, Types, Utils } from 'kilo/lib'

import { TiledLevel } from '../tiled-level'

export class GameScene extends Scene {
  private gameMap: TiledLevel
  private camera: Camera

  constructor(game: Game, onComplete: Function) {
    super(game, onComplete)

    const extraLayer = { name: 'bg', isAboveLevel: false }

    Game.assets.json('assets/levels/example.json').then((mapData: any) => {
      const tMap = Utils.tiledParser(mapData, [extraLayer])
      const level = new TiledLevel(tMap)

      const worldSize = new Types.Vec(
        (level.mapWidth * level.tileWidth),
        (level.mapHeight * level.tileHeight)
      )

      const target = new Types.Sprite(
        new Types.Texture('assets/images/character.png')
      )
      target.pos.set(worldSize.x / 2, worldSize.y / 2)

      const cam = new Camera(target,
        new Types.Rect(game.width, game.height),
        new Types.Rect(worldSize.x, worldSize.y)
      )

      this.camera = this.add<Camera>(cam)

      this.gameMap = this.camera.add<TiledLevel>(level)
    })
  }
}

