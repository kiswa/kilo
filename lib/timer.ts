/**
 * @packageDocumentation
 * @module kilo
 */

 /**
  * Function called on each tick of a Timer.
  */
 type TickFunc = (r: number) => void

/**
 * Countdown timer that calls a function on each tick, and optionally
 * on completion.
 *
 * ### Example
 * ```typescript
// Moving a sprite into position on a game scene over 2 seconds,
// with a half-second delay before starting.
const timer = new Timer((r: number) =>
  (sprite.pos.y = elasticOut(r) * game.height - game.height / 1.6),
  () => {}, 2, .5
)
```
 */
export class Timer {
  /** Used by core loop to remove the object when dead. */
  dead: boolean
  /** Used by core loop to skip rendering. False, unless changed by user. */
  visible: boolean

  private elapsed: number
  private duration: number
  private delay: number

  private onTick: Function
  private onDone: Function

  /**
   * Initialize Timer object.
   *
   * @param duration Time in seconds for the timer to run.
   * @param onTick Function called every tick (core loop update).
   * @param onDone Function called on timer completion.
   * @param delay Time in seconds to wait before starting timer.
   */
  constructor(onTick: TickFunc, onDone?: Function, duration = 1, delay = 0) {
    this.elapsed = 0
    this.duration = duration
    this.delay = delay

    this.dead = false
    this.visible = false

    this.onTick = onTick
    this.onDone = onDone
  }

  /**
   * Called by core loop each tick.
   *
   * Updates internal state and calls `onTick` or `onDone` functions as needed.
   *
   * @param dt Delta time since last update.
   */
  update(dt: number) {
    if (this.delay > 0) {
      this.delay -= dt
      return
    }

    this.elapsed += dt
    const ratio = this.elapsed / this.duration

    if (ratio >= 1) {
      this.onDone && this.onDone()
      this.dead = true

      return
    }

    this.onTick && this.onTick(ratio)
  }
}
