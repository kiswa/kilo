/**
 * @module kilo/fx
 */
import { Container, TileSprite } from '../'
import { Rect, Vec } from '../types'
import { math } from '../utils'

/**
 * Options used to determine particle behaviors.
 *
 * Ranges use a [[Vec]] where the x value is the minimum, and y is the maximum.
 *
 * @category kilo/fx
 */
export interface ParticleOptions {
  /**
   * Range of values to use for horizontal velocity.
   * @default -5 to 5
   */
  horizontalVelRange: Vec

  /**
   * Range of values to use for vertical velocity.
   * @default -5 to -10
   */
  verticalVelRange: Vec

  /**
   * Range of values to use for particle life in seconds.
   * @default .8 to 1.5
   */
  lifeSecRange: Vec

  /**
   * Default particle size to use if no display object passed in.
   * @default 10 by 10
   */
  defaultSize: Vec

  /**
   * Fill style to use if no display object passed in.
   * @default '#900'
   */
  fill: string
}

/**
 * A single particle whose lifecycle is controlled by a [[ParticleEmitter]].
 *
 * Can be used alone if desired as a randomly moving and fading entity.
 *
 * @category kilo/fx
 */
export class Particle extends Container {
  private options: ParticleOptions
  private vel: Vec
  private life: number

  /**
   * Initialize Particle object.
   *
   * @param display TileSprite (or Rect) to use for display.
   * @param options Options affecting particle behaviors.
   * See [[ParticleOptions]] for default values if not passed in.
   */
  constructor(display?: Rect | TileSprite, options?: ParticleOptions) {
    super()

    this.vel = new Vec()
    this.alpha = this.life = 0

    this.options = options || {
      horizontalVelRange: new Vec(-5, 5),
      verticalVelRange: new Vec(-5, -10),
      lifeSecRange: new Vec(.8, 1.5),
      defaultSize: new Vec(10, 10),
      fill: '#900'
    }

    this.add(display || new Rect(
      this.options.defaultSize.x,
      this.options.defaultSize.y,
      { fill: this.options.fill }
    ))
  }

  /**
   * Reset the particle with random values within established ranges.
   */
  reset() {
    const {
      horizontalVelRange: h,
      verticalVelRange: v,
      lifeSecRange: l
    } = this.options

    this.vel.set(
      math.randf(h.x, h.y), math.randf(v.x, v.y)
    )

    this.life = math.randf(l.x, l.y)
    this.pos.set(0, 0)
  }

  /**
   * Update state of the particle.
   *
   * Exits early if the particle's time is up.
   *
   * @param dt Delta time since last update.
   */
  update(dt: number) {
    if (this.life <= 0) {
      return
    }

    this.life -= dt

    this.pos.add(this.vel)
    this.vel.add({ x: 0, y: 30 * dt } as Vec)
    this.alpha = math.clamp(this.life)
  }
}
