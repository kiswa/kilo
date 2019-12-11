import { Container } from '../container'
import { Vec, Rect } from '../types'
import { TileSprite, Utils } from '..'

/**
 * An effect where the provided {@link TileSprite} or {@link Rect}
 * (defaults to rectangle if not provided) is moved away from its starting
 * position at the specified speed and duration.
 *
 * Default behavior is moving up and fading out over 0.6 seconds.
 *
 * ### Example
 * ```typescript
// Inside a 'gotPickup' or similar function
const coin = new TileSprite(texture, 48, 48)
coin.anims.add('spin', [5, 6, 7, 8].map(x => ({ x, y: 4 } as any)), .1)
coin.anims.play('spin')

const one = this.add<OneUp>(new OneUp(coin))
one.pos.copy(this.player.pos)
```
 */
export class OneUp extends Container {
  private vel: Vec

  private duration: number
  private life: number

  /**
   * Initialize OneUp object.
   *
   * @param display TileSprite (or Rect) to use for display.
   * Rectangle created if not provided.
   * @param speed Speed (and x-axis direction by numeric sign) to move from
   * initial point.
   * @param duration Time in seconds to fade out.
   */
  constructor(display?: TileSprite | Rect, speed = 2, duration = .6) {
    super()

    this.vel = new Vec(0, -speed)
    this.duration = duration
    this.life = duration
    this.children = [display || new Rect(40, 30, { fill: '#ff0' })]
  }

  /**
   * Update the state of the OneUp.
   *
   * @param dt Delta time since last update.
   * @param t Timestamp in seconds.
   */
  update(dt: number, t: number) {
    super.update(dt, t)

    this.alpha = Utils.math.clamp(this.life / this.duration)
    this.pos.add(this.vel)

    this.dead = ((this.life -= dt) <= 0)
  }
}
