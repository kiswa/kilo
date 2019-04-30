/**
 * @module kilo
 */
import { Container, TileSprite } from '.'
import { HitBox, Point, Texture, Vec } from './types'

interface HasFrame {
  frame: Point
}

/**
 * A customized Container of [[TileSprite]] objects that provides helper methods
 * for accessing tiles.
 */
export class TileMap extends Container {
  /** Width of the entire map in tiles. */
  mapWidth: number
  /** Height of the entire map in tiles. */
  mapHeight: number
  /** Width of one tile in pixels. */
  tileWidth: number
  /** Height of one tile in pixels. */
  tileHeight: number

  /**
   * Initialize TileMap object.
   *
   * @param tiles Array of arrays of objects with at least a `frame` property.
   * @param mapWidth Width of the entire map in tiles.
   * @param mapHeight Height of the entire map in tiles.
   * @param tileWidth Width of one tile in pixels.
   * @param tileHeight Height of one tile in pixels.
   * @param texture Texture to use for tiles.
   */
  constructor(tiles: Array<Array<HasFrame>>, mapWidth: number, mapHeight: number,
              tileWidth: number, tileHeight: number, texture: Texture) {
    super()

    this.mapWidth = mapWidth
    this.mapHeight = mapHeight
    this.tileWidth = tileWidth
    this.tileHeight = tileHeight

    for (let i = 0; i < tiles.length; i++) {
      for (let j = 0; j < tiles[i].length; j++) {
        const s = new TileSprite(texture, tileWidth, tileHeight)

        s.frame = tiles[i][j].frame
        s.pos.x = j % mapWidth * tileWidth,
          s.pos.y = Math.floor(j / mapWidth) * tileHeight

        this.children.push(s)
      }
    }
  }

  /**
   * Converts a pixel location to a map tile location.
   *
   * @param pos Pixel location to convert.
   */
  pixelToMapPos(pos: Vec) {
    return new Vec(
      Math.floor(pos.x / this.tileWidth),
      Math.floor(pos.y / this.tileHeight)
    )
  }

  /**
   * Converts a map tile location to a pixel location.
   *
   * @returns Top-left corner pixel coordinate.
   *
   * @param mapPos Map location to convert.
   */
  mapToPixelPos(mapPos: Vec) {
    return new Vec(
      mapPos.x * this.tileWidth,
      mapPos.y * this.tileHeight
    )
  }

  /**
   * Gets the tile at the specified location.
   *
   * @param mapPos Tile location to lookup tile.
   */
  tileAtMapPos(mapPos: Vec) {
    return <TileSprite>this.children[mapPos.y * this.mapWidth + mapPos.x]
  }

  /**
   * Gets the tile at the specified location.
   *
   * @param pos Pixel location to lookup tile.
   */
  tileAtPixelPos(pos: Vec) {
    return this.tileAtMapPos(this.pixelToMapPos(pos))
  }

  /**
   * Gets the tile at the specified location and sets the `frame` property.
   *
   * @param mapPos Tile location to lookup tile.
   * @param frame The frame to set on the tile.
   */
  setTileFrameAtMapPos(mapPos: Vec, frame: Point) {
    const tile = this.tileAtMapPos(mapPos)

    tile.frame = frame

    return tile
  }

  /**
   * Gets the tile at the specified location and sets the `frame` property.
   *
   * @param pos Pixel location to lookup tile.
   * @param frame The frame to set on the tile.
   */
  setTileFrameAtPixelPos(pos: Vec, frame: Point) {
    return this.setTileFrameAtMapPos(this.pixelToMapPos(pos), frame)
  }

  /**
   * Gets the tiles at all four corners of the specified HitBox.
   *
   * @param box HitBox to test for corner tiles.
   * @param xo X axis offset to check against.
   * @param yo Y axis offset to check against.
   */
  tilesAtCorners(box: HitBox, xo = 0, yo = 0): Array<TileSprite> {
    const tiles = []
    const corners = [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height]
    ]

    for (let i = 0; i < corners.length; i++) {
      tiles.push(this.tileAtPixelPos(<any>{
        x: corners[i][0] + xo,
        y: corners[i][1] + yo
      }))
    }

    return tiles
  }
}
