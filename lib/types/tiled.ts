/**
 * @packageDocumentation
 * @ignore
 */

/** Descriptor for exported JSON from Tiled Map Editor. */
declare namespace Tiled {
  /** The Tiled map. */
  interface Map {
    /** Height of the map in tiles. */
    height: number
    /** Width of the map in tiles. */
    width: number
    /** Height of a tile in pixels. */
    tileheight: number
    /** Width of a tile in pixels. */
    tilewidth: number

    /** Layers in map. */
    layers: Layer[]
    /** Tilesets in the map. */
    tilesets: Tileset[]

    /** Properties set on the map. */
    properties?: Property[]
  }

  /** A Property object in Tiled. */
  interface Property {
    /** The name of the property. */
    name: string
    /** The value of the property. */
    value: string
    /** The type of the property. */
    type: string
  }

  /** A Tile in Tiled. */
  interface Tile {
    /** The ID of the tile in the tileset. */
    id: number
    /** The type of the tile. */
    type: string

    /** Properties set on the tile. */
    properties?: Property[]
  }

  /** An Object in Tiled. */
  interface Object {
    /** The global ID of the object. */
    gid: number
    /** The local Id of the object. */
    id: number

    /** X value of the object. */
    x: number
    /** Y value of the object. */
    y: number

    /** Height in pixels. */
    height: number
    /** Width in pixels. */
    width: number

    /** Type of the object. */
    type: string
    /** Name of the object. */
    name: string

    /** Properties set on the object. */
    properties?: Property[]
  }

  /** A Layer in Tiled. */
  interface Layer {
    /** The name of the layer. */
    name: string
    /** The type of the layer. */
    type: string

    /** The opacity of the layer. */
    opacity: number

    /** If a tile layer, this is an array of tile IDs. */
    data?: number[]
    /** If an object layer, this is an array of Objects. */
    objects?: Tiled.Object[]
    /** Properties set on the layer. */
    properties?: Property[]
  }

  /** A Tileset in Tiled. */
  interface Tileset {
    /** Number of columns in the tileset. */
    columns: number
    /** The first global ID in the tileset. */
    firstgid: number

    /** Height of a tile in pixels. */
    tileheight: number
    /** Width of a tile in pixels. */
    tilewidth: number

    /** Source image for the tiles. */
    image: string
    /** Height of the image in pixels. */
    imageheight: number
    /** Width of the image in pixels. */
    imagewidth: number

    /** If set, an array of Tile data. */
    tiles?: Tile[]
    /** Properties set on the tileset. */
    properties?: Property[]
  }
}
