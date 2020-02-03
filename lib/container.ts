/**
 * @packageDocumentation
 * @module kilo
 */
import { Entity } from './types'

/**
 * Holds game objects updated and/or rendered in the game loop.
 *
 * Basically, just an {@link Entity} with an `update` implementation.
 *
 * ### Example
 * ```typescript
const pickups = new Container()

// Assuming there is a 'Pickup' type in your game.
mapData.pickupLocations.forEach(pos => {
 pickups.push(new Pickup(pos))
})
```
 */
export class Container extends Entity {

  constructor() {
    super()
  }

  /**
   * Update each child in the container.
   *
   * Automatically removes any child object marked as dead.
   *
   * @param dt Delta time since last update.
   * @param t Timestamp in seconds.
   */
  update(dt: number, t: number) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i]

      if (child.dead) {
        this.children.splice(i, 1)
        i--
        continue
      }

      child.update(dt, t)
    }
  }
}
