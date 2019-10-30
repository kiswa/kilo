/**
 * @module kilo/utils
 */
import { Container, Utils } from '../'
import { Vec, Rect, Sprite, HitBox } from '../types'

/**
 * Adds display [[Rect]] for the sprite's size and hitbox (if set).
 *
 * @param e Sprite to have debug display added.
 *
 * @category kilo/utils
 */
export function addDebug(e: Sprite) {
  const bb = new Rect(e.width, e.height, { fill: 'rgba(255, 0, 0, 0.3)' })
  e.children.push(bb)

  if (e.hitBox) {
    const { x, y, width, height } = e.hitBox
    const hb = new Rect(width, height, { fill: 'rgba(255, 0, 0, 0.5)' })

    hb.pos.x = x
    hb.pos.y = y

    e.children.push(hb)
  }

  return e
}

/**
 * Gets the angle from one sprite to another.
 *
 * @param a Sprite to get angle from.
 * @param b Sprite to get angle to.
 *
 * @category kilo/utils
 */
export function angle(a: Sprite, b: Sprite) {
  return Utils.math.angle(center(a), center(b))
}

/**
 * Gets the calculated bounds of a sprite.
 *
 * @param entity Sprite to get bounds from.
 *
 * @category kilo/utils
 */
export function bounds(entity: Sprite) {
  const { pos, hitBox, width, height } = entity
  const hit = hitBox || new HitBox(0, 0, width, height)

  return new HitBox(hit.x + pos.x, hit.y + pos.y, hit.width - 1, hit.height - 1)
}

/**
 * Gets the center point of a tile sprite.
 *
 * @param sprite Sprite to get center from.
 *
 * @category kilo/utils
 */
export function center(sprite: Sprite) {
  const { pos, width, height } = sprite

  return new Vec(
    pos.x + width / 2,
    pos.y + height / 2
  )
}

/**
 * Gets the distance from one tile sprite to another.
 *
 * @param a Sprite to get distance from.
 * @param b Sprite to get distance to.
 *
 * @category kilo/utils
 */
export function distance(a: Sprite, b: Sprite) {
  return Utils.math.distance(center(a), center(b))
}

function isHit(a: HitBox, b: HitBox) {
  return (
    a.x + a.width >= b.x &&
    a.x <= b.x + b.width &&
    a.y + a.height >= b.y &&
    a.y <= b.y + b.height
  )
}

/**
 * Tests for collision between two sprites.
 *
 * @param e1 Sprite to test for collision.
 * @param e2 Other sprite to test for collision.
 *
 * @category kilo/utils
 */
export function hit(e1: Sprite, e2: Sprite) {
  const a = bounds(e1)
  const b = bounds(e2)

  return isHit(a, b)
}

/**
 * Checks a sprite for collisions with any child of the provided container.
 *
 * @param entity Sprite to check against children of container.
 * @param container Container of sprites to test against.
 * @param hitCallback Function to call when a collision is detected.
 *
 * @category kilo/utils
 */
export function hits(entity: Sprite, container: Container, hitCallback: Function) {
  const a = bounds(entity)

  container.map((e2: Sprite) => {
    const b = bounds(e2)

    if (isHit(a, b)) {
      hitCallback(e2)
    }
  })
}
