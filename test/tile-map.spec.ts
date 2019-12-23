import { expect } from 'chai'

import { TileMap } from '../lib/'
import { Texture, Vec, HitBox } from '../lib/types/'
import { TiledMap } from '../lib/utils/'

describe('TileMap', () => {
  let map: TileMap

  const tex = new Texture('')
  const tiles = [
    [{ frame: new Vec(0, 0), x: 0, y: 0 }]
  ]
  const data: TiledMap = {
    tileWidth: 16,
    tileHeight: 16,
    mapWidth: 32,
    mapHeight: 32,
    tiles: tiles,
    levelIndex: 0,

    getObjectByName: (_) => undefined,
    getObjectsByType: (_) => undefined
  }

  describe('Properties', () => {
    beforeEach(() => {
      map = new TileMap(tiles, data, tex)
    })

    it('has property mapHeight', () => {
      expect(map).to.have.property('mapHeight').that.equals(32)
    })

    it('has property mapWidth', () => {
      expect(map).to.have.property('mapWidth').that.equals(32)
    })

    it('has property tileHeight', () => {
      expect(map).to.have.property('tileHeight').that.equals(16)
    })

    it('has property tileWidth', () => {
      expect(map).to.have.property('tileWidth').that.equals(16)
    })
  })

  describe('Accessors', () => {
    beforeEach(() => {
      tiles.length = 0
      tiles.push([])

      for (let i = 0; i < 16; i++) {
        tiles[0].push({ frame: new Vec(), x: 0, y: 0 })
      }

      data.tileWidth = 16
      data.tileHeight = 16
      data.mapWidth = 4
      data.mapHeight = 4
      data.tiles = tiles as any

      map = new TileMap(tiles, data, tex)
    })

    it('has get accessor layersUpToLevel', () => {
      expect(map).to.have.property('layersUpToLevel')
      expect(map.layersUpToLevel.length).to.equal(1)
    })

    it('has get accessor layersAboveLevel', () => {
      expect(map).to.have.property('layersUpToLevel')
      expect(map.layersAboveLevel.length).to.equal(1)
    })
  })

  describe('Methods', () => {
    beforeEach(() => {
      tiles.length = 0
      tiles.push([])

      for (let i = 0; i < 16; i++) {
        tiles[0].push({ frame: new Vec(), x: 0, y: 0 })
      }

      data.tileWidth = 16
      data.tileHeight = 16
      data.mapWidth = 4
      data.mapHeight = 4
      data.tiles = tiles as any

      map = new TileMap(tiles, data, tex)
    })

    it('has method pixelToMapPos', () => {
      expect(map.pixelToMapPos).to.be.a('function')

      expect(map.pixelToMapPos(new Vec(17, 6)).x).to.equal(1)
    })

    it('has method mapToPixelPos', () => {
      expect(map.mapToPixelPos).to.be.a('function')

      expect(map.mapToPixelPos(new Vec(1, 1)).y).to.equal(16)
    })

    it('has method tileAtMapPos', () => {
      expect(map.tileAtMapPos).to.be.a('function')

      expect(map.tileAtMapPos(new Vec()).frame).to.equal(tiles[0][0].frame)
    })

    it('has method tileAtPixelPos', () => {
      expect(map.tileAtPixelPos).to.be.a('function')

      expect(map.tileAtPixelPos(new Vec(14, 14)).frame).to.equal(tiles[0][0].frame)
    })

    it('has method setTileFrameAtMapPos', () => {
      expect(map.setTileFrameAtMapPos).to.be.a('function')

      map.setTileFrameAtMapPos(new Vec(0, 1), new Vec(1, 1))
      const layer = map.children[0] as any
      expect(layer.children[4].frame.x).to.equal(1)
    })

    it('has method setTileFrameAtPixelPos', () => {
      expect(map.setTileFrameAtPixelPos).to.be.a('function')

      map.setTileFrameAtPixelPos(new Vec(8, 8), new Vec(1, 1))
      const layer = map.children[0] as any
      expect(layer.children[0].frame.x).to.equal(1)
    })

    it('has method tilesAtCorners', () => {
      expect(map.tilesAtCorners).to.be.a('function')

      const hb = new HitBox(0, 0, 12, 12)
      const corners = map.tilesAtCorners(hb, 12, 12)

      expect(corners.length).to.equal(4)
      expect(corners[0].pos.x).to.equal(0)
      expect(corners[1].pos.x).to.equal(16)
      expect(corners[2].pos.y).to.equal(16)
      expect(corners[3].pos.x).to.equal(16)

      map.tilesAtCorners(hb)
    })
  })
})


