/**
 * @module kilo/resolvers
 */
import { Utils, TileMap } from '..'
import { Sprite, Vec } from '../types'

/**
 * Collision resolver that prevents all movement if a collision is detected.
 *
 * @param ent The Sprite entity to check.
 * @param map The TileMap to use for collisions.
 * @param x Desired movement in the X axis.
 * @param y Desired movement in the Y axis.
 */
export function stopMovement(ent: Sprite, map: TileMap, x = 0, y = 0) {
  const box = Utils.sprite.bounds(ent)
  const tiles = map.tilesAtCorners(box, x, y)
  let blocked = false

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] && !tiles[i].frame.walkable) {
      blocked = true
      break
    }
  }

  if (blocked) {
    x = 0
    y = 0
  }

  return new Vec(x, y)
}
