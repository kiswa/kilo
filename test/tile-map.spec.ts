import { expect } from 'chai'

import { TileMap } from '../lib/'
import { Texture, Vec, HitBox } from '../lib/types/'

describe('TileMap', () => {
  let map: TileMap

  const tex = new Texture('')
  const tiles = [
    { frame: new Vec(0, 0) }
  ]

  describe('Properties', () => {
    beforeEach(() => {
      map = new TileMap(tiles, 32, 32, 16, 16, tex)
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

  describe('Methods', () => {
    beforeEach(() => {
      tiles.length = 0
      for (let i = 0; i < 16; i++) {
        tiles.push({ frame: new Vec() })
      }

      map = new TileMap(tiles, 4, 4, 16, 16, tex)
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

      expect(map.tileAtMapPos(new Vec()).frame).to.equal(tiles[0].frame)
    })

    it('has method tileAtPixelPos', () => {
      expect(map.tileAtPixelPos).to.be.a('function')

      expect(map.tileAtPixelPos(new Vec(14, 14)).frame).to.equal(tiles[0].frame)
    })

    it('has method setTileFrameAtMapPos', () => {
      expect(map.setTileFrameAtMapPos).to.be.a('function')

      map.setTileFrameAtMapPos(new Vec(0, 1), new Vec(1, 1))
      expect((<any>map.children[4]).frame.x).to.equal(1)
    })

    it('has method setTileFrameAtPixelPos', () => {
      expect(map.setTileFrameAtPixelPos).to.be.a('function')

      map.setTileFrameAtPixelPos(new Vec(8, 8), new Vec(1, 1))
      expect((<any>map.children[0]).frame.x).to.equal(1)
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


