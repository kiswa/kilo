/**
 * @packageDocumentation
 * @module kilo
 */
import { Point } from './types'

/**
 * @ignore
 * @internal
 */
class Animation {
  frame: Point

  private frames: Point[]
  private rate: number
  private curFrame: number
  private curTime: number

  constructor(frames: Point[], rate: number) {
    this.frames = frames
    this.rate = rate
  }

  reset() {
    this.frame = this.frames[0]
    this.curFrame = 0
    this.curTime = 0
  }

  update(dt: number) {
    if ((this.curTime += dt) > this.rate) {
      this.curFrame++
      this.frame = this.frames[this.curFrame % this.frames.length]
      this.curTime -= this.rate
    }
  }
}

/**
 * Handles animations for an object.
 *
 * ### Example
 * ```typescript
 // In the implementation of a class
 this.anims = new Animations({ x: 0, y: 0, custom: 'properties' })
 // Create 'idle' animation with two frames that change every half second.
 this.anims.add('idle', [{ x: 0, y: 0 }, { x: 1, y: 0}], .5)

 // In the update of the same class
 this.anims.play('idle')
```
 */
export class Animations {
  private anims: Map<string, Animation>
  private frameSource: any
  private current: string

  /**
   * Initialize Animations object.
   *
   * @param frame An object with x and y properties.
   */
  constructor(frame: Point) {
    this.anims = new Map<string, Animation>()
    this.frameSource = frame
    this.current = null
  }

  /**
   * Add a new animation by name, using specified frames and timing.
   *
   * Overrides existing animation if the same name is used.
   *
   * @param name The animation name.
   * @param frames Sprite frames used in the animation.
   * @param speed How quickly to change between frames (based upon delta time).
   */
  add(name: string, frames: Point[], speed: number): Animation {
    this.anims.set(name, new Animation(frames, speed))

    return this.anims.get(name)
  }

  /**
   * Set the named animation as the current animation and reset it.
   *
   * @param anim The name of the animation to play.
   */
  play(anim: string) {
    if (anim === this.current) {
      return
    }

    this.current = anim
    this.anims.get(anim).reset()
  }

  /** Stop the current animation. */
  stop() {
    this.current = null
  }

  /**
   * Update the current animation if one is set.
   *
   * Called by [TileSprite.update()]{@link TileSprite#update}.
   *
   * @param dt Delta time since last update.
   */
  update(dt: number) {
    if (!this.current) {
      return
    }

    const anim = this.anims.get(this.current)
    anim.update(dt)

    this.frameSource.x = anim.frame.x
    this.frameSource.y = anim.frame.y
  }
}
