import { TileMap, Types, Utils } from 'kilo/lib'

import 'kilo/lib/types/tiled'

const texture = new Types.Texture('assets/images/tilesheet.png')

export class TiledLevel extends TileMap {
  gameObjects: {
    player: Tiled.Object,
    death: Tiled.Object[],
    breakable: Tiled.Object[]
  }

  constructor(data: Utils.TiledMap) {
    const tiles = data.tiles.map((tiles: any) => {
      return tiles.map((tile: any) => ({ frame: { ...tile } }))
    })

    super(tiles, data.mapWidth, data.mapHeight,
          data.tileWidth, data.tileHeight, texture)

    this.gameObjects = this.getGameObjects(data)
  }

  private getGameObjects(data: Utils.TiledMap) {
    return {
      player: data.getObjectByName('spawn', true),
      death: data.getObjectsByType('death'),
      breakable: data.getObjectsByType('breakable')
    }
  }
}
