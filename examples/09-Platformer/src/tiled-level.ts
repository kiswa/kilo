import { TileMap, Types, Utils } from 'kilo/lib'

import 'kilo/lib/types/tiled'

const texture = new Types.Texture('assets/images/tilesheet.png')

/*
 * It is important to extend TileMap to allow for unique properties of your
 * particular game map. In this case, the tile data is mapped into a new form
 * and specific game objects are loaded for future use.
 */
export class TiledLevel extends TileMap {
  gameObjects: {
    player: Tiled.Object,
    exit: Tiled.Object
  }

  constructor(data: Utils.TiledMap) {
    const tiles = data.tiles.map((tiles: any) => {
      return tiles.map((tile: any) => ({ frame: { ...tile } }))
    })

    super(tiles, data, texture)

    this.gameObjects = this.getGameObjects(data)
  }

  private getGameObjects(data: Utils.TiledMap) {
    return {
      player: data.getObjectByName('spawn', true),
      exit: data.getObjectByName('exit', true)
    }
  }
}
