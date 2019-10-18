import { Entity } from './types'

/**
 * Holds game objects updated and/or rendered in the game loop.
 *
 * Basically, just an [[Entity]] with some helper methods.
 *
 * ### Example
 * ```typescript
 * const pickups = new Container()
 *
 * // Assuming there is a 'Pickup' type in your game.
 * mapData.pickupLocations.forEach(pos => {
 *  pickups.push(new Pickup(pos))
 * })
 * ```
 *
 * @category kilo
 */
export class Container extends Entity {
  /**
   * Add a child object.
   *
   * @param child Object to add to the container.
   */
  add<T>(child: any) {
    this.children.push(child)

    return <T>child
  }

  /**
   * Remove a child object.
   *
   * @param child Object to remove from the container.
   */
  remove<T>(child: any) {
    const filtered = []
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        continue
      }

      filtered.push(this.children[i])
    }

    this.children = filtered.slice()

    return <T>child
  }

  /**
   * Update each child in the container.
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
