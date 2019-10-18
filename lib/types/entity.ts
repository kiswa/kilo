import { Vec } from '.'

/** A type with an update function. */
type HasUpdate = {
  update: Function
  dead: boolean
}

/**
 * An abstract base class for all entities.
 *
 * @category kilo/types
 */
export abstract class Entity {
  /** Whether or not the entity is visible. */
  visible: boolean
  /** Whether or not the entity is dead. */
  dead: boolean

  /** The opacity of the entity (from 0 to 1) */
  alpha: number

  /** Position of the entity. */
  pos: Vec
  /** Scale of the entity. */
  scale: Vec

  /** An array of child entities for recursive update/render. */
  children: HasUpdate[]

  /** Whether or not there are any child entities. */
  get hasChildren(): boolean {
    return this.children.length > 0
  }

  /**
   * Initialize an Entity object.
   */
  constructor() {
    this.visible = true
    this.dead = false

    this.alpha = 1

    this.pos = new Vec()
    this.scale = new Vec(1, 1)

    this.children = []
  }

  /**
   * Update method to be implemented by classes extending Entity.
   *
   * @param dt Delta time since last update.
   * @param t Timestamp in seconds.
   */
  abstract update(dt: number, t: number): void

  /**
   * Adds a child object to the entity.
   *
   * @param child Child to add to the entity.
   */
  add(child: HasUpdate) {
    this.children.push(child)

    return child
  }

  /**
   * Maps a function across all children.
   *
   * @param fn Function to call for each child.
   */
  map(fn: (child: HasUpdate, index?: number) => void): any {
    const result = []

    for (const [i, child] of this.children.entries()) {
      result[i] = fn(child, i)
    }

    return result
  }
}
