/**
 * @module kilo/resolvers
 */
import { Sprite } from '../types'
import { TileMap, Utils, TileSprite } from '..'

/**
 * Function used to provide collision resolver with walkable tile status.
 */
export type WalkableTest = (sprite: TileSprite, index: number) => boolean

/**
 * Directions where collisions are detected.
 */
export interface Hits {
  /** Whether or not a collision was detected from above.  */
  up: boolean
  /** Whether or not a collision was detected from below.  */
  down: boolean
  /** Whether or not a collision was detected from the left.  */
  left: boolean
  /** Whether or not a collision was detected from the right.  */
  right: boolean
}

/**
 * The offsets to apply to resolve collisions, as well as the hit directions.
 */
export interface Resolution {
  /** Correction needed in the x axis. */
  x: number
  /** Correction needed in the y axis. */
  y: number
  /** Directions where collisions were detected. */
  hits: Hits
}

/**
 * Collision resolver that only prevents invalid movements.
 *
 * @param ent The Sprite entity to check.
 * @param map The TileMap to use for collision.
 * @param x Desired movement in the X axis.
 * @param y Desired movement in the Y axis.
 * @param walkableTest Callback function to test for walkable tiles.
 *
 * @category kilo/resolvers
 */
export function wallSlide(ent: Sprite, map: TileMap, x = 0, y = 0,
                          walkableTest?: WalkableTest): Resolution {
  let tiles: TileSprite[]
  let tileEdge: number

  const bounds = Utils.sprite.bounds(ent)
  const hits = { up: false, down: false, left: false, right: false }

  let xo = x
  let yo = y

  if (y !== 0) {
    tiles = map.tilesAtCorners(bounds, 0, yo)

    let walkables = [false, false, false, false]
    if (walkableTest) {
      for (let i = 0; i < tiles.length; i++) {
        walkables[i] = walkableTest(tiles[i], i)
      }
    }

    const [tl, tr, bl, br] = walkables

    if (y < 0 && !(tl && tr)) {
      hits.up = true
      tileEdge = tiles[0].pos.y + tiles[0].height
      yo = tileEdge - bounds.y
    }

    if (y > 0 && !(bl && br)) {
      hits.down = true
      tileEdge = tiles[2].pos.y - 1
      yo = tileEdge - (bounds.y + bounds.height)
    }
  }

  if (x !== 0) {
    tiles = map.tilesAtCorners(bounds, xo, yo)

    let walkables = [false, false, false, false]
    if (walkableTest) {
      for (let i = 0; i < tiles.length; i++) {
        walkables[i] = walkableTest(tiles[i], i)
      }
    }

    const [tl, tr, bl, br] = walkables

    if (x < 0 && !(tl && bl)) {
      hits.left = true
      tileEdge = tiles[0].pos.x + tiles[0].width
      xo = tileEdge - bounds.x
    }

    if (x > 0 && !(tr && br)) {
      hits.right = true
      tileEdge = tiles[1].pos.x - 1
      xo = tileEdge - (bounds.x + bounds.width)
    }
  }

  return { x: xo, y: yo, hits }
}
