import { Container, TileSprite, Utils } from '.'
import { Sprite, Rect, Vec } from './types'

/**
 * Follows a subject to provide a viewport into a game world.
 *
 * ### Example
 * Assumes this is in a {@link Scene}.
 *
 * ```typescript
const camera = new Camera(player, { width: 640, height: 480 } as Rect, {
   width: map.mapWidth * map.tileWidth,
   height: map.mapHeight * map.tileHeight
 } as Rect)

this.camera = this.add<Camera>(camera)
```
 */
export class Camera extends Container {
  /**
   * Amount to move towards subject per update.
   *
   * Range from 0 to 1 where 0 is not moving, and 1 is always on subject.
   * Default is .3
   */
  easing: number

  private shakePower: number
  private shakeDecay: number
  private shakeLast: Vec

  private flashTime: number
  private flashDuration: number
  private flashRect: Rect

  private width: number
  private height: number

  private debug: Rect
  private worldSize: Rect

  private tracking: Vec
  private offset: Vec
  private subject: Vec

  /**
   * Initialize Camera object.
   *
   * The {@link Rect} parameters only require `width` and `height` properties.
   *
   * @param subject The {@link TileSprite} or {@link Sprite} for the camera to follow.
   * @param viewport Size of the camera's view into the game.
   * @param worldSize Size of the game world. Uses `viewport` by default.
   */
  constructor(subject: TileSprite | Sprite, viewport: Rect,
              worldSize: Rect = viewport) {
    super()

    this.width = viewport.width
    this.height = viewport.height
    this.worldSize = worldSize

    this.shakePower = 0
    this.shakeDecay = 0
    this.shakeLast = new Vec()

    this.flashTime = 0
    this.flashDuration = 0
    this.flashRect = null

    this.easing = .3

    this.setTracking(64, 48)
    this.setSubject(subject)
  }

  /**
   * Set debug status on camera.
   *
   * When true, a rectangle displays on-screen showing camera tracking bounds.
   *
   * Only call after everything is added to the camera.
   *
   * @param debug Whether to turn debugging on or off.
   */
  setDebug(debug = true) {
    if (debug) {
      this.debug = this.add<Rect>(
        new Rect(
          this.tracking.x * 2,
          this.tracking.y * 2,
          { fill: 'rgba(255, 0, 0, 0.2)' }
        )
      )

      return
    }

    this.remove(this.debug)
  }

  /**
   * Update tracking offsets used to keep the subject in view.
   *
   * @param xo Offset of tracking space from sides on X axis.
   * @param yo Offset of tracking space from sides on Y axis.
   */
  setTracking(xo: number, yo: number) {
    this.tracking = new Vec(xo, yo)
  }

  /**
   * Update the subject being tracked by the camera.
   *
   * Also causes the camera to refocus to the new subject.
   *
   * @param sprite The new subject to track.
   */
  setSubject(sprite: TileSprite | Sprite) {
    this.subject = sprite.pos
    this.offset = new Vec()

    this.offset.x += sprite.width / 2
    this.offset.y += sprite.height / 2

    this.offset.x -= sprite.anchor.x
    this.offset.y -= sprite.anchor.y

    this.focus()
  }

  /**
   * Shake the camera randomly for a short time.
   *
   * @param power Number of pixels to shake the camera.
   * @param duration Time in seconds to shake.
   */
  shake(power = 5, duration = .5) {
    this.shakePower = power
    this.shakeDecay = power / duration
  }

  /**
   * Add a brief overlay to 'flash' the viewport.
   *
   * @param duration Time in seconds for flash to fade out.
   * @param color Color of the overlay used.
   */
  flash(duration = .2, color = '#fff') {
    if (!this.flashRect) {
      this.flashRect = <Rect>this.add(
        new Rect(this.width, this.height, { fill: color })
      )
    }

    this.flashDuration = duration
    this.flashTime = duration
  }

  /**
   * Focus the camera on the subject.
   *
   * @param ease Range from 0 to 1 where 0 is not moving, and 1 is on subject.
   * @param track Whether or not to keep the subject in tracking limits.
   */
  focus(ease = 1, track = true) {
    const target = this.subject

    const centeredX = target.x + this.offset.x - this.width / 2
    const maxX = this.worldSize.width - this.width
    let x = -Utils.math.clamp(centeredX, 0, maxX)

    const centeredY = target.y + this.offset.y - this.height / 2
    const maxY = this.worldSize.height - this.height
    let y = -Utils.math.clamp(centeredY, 0, maxY)

    if (this.debug) {
      this.debug.pos.set(
        -this.pos.x + this.width / 2 - this.tracking.x,
        -this.pos.y + this.height / 2 - this.tracking.y
      )
    }

    if (track) {
      if (Math.abs(centeredX + this.pos.x) < this.tracking.x) {
        x = this.pos.x
      }

      if (Math.abs(centeredY + this.pos.y) < this.tracking.y) {
        y = this.pos.y
      }
    }

    this.pos.set(
      Utils.math.mix(this.pos.x, x, ease / 10),
      Utils.math.mix(this.pos.y, y, ease / 10)
    )
  }

  /**
   * Update the camera.
   *
   * @param dt Delta time since last update.
   * @param t Timestamp in seconds.
   */
  update(dt: number, t: number) {
    super.update(dt, t)

    this.unShake()

    if (this.subject) {
      this.focus(this.easing)
    }

    this.doShake(dt)
    this.doFlash(dt)
  }

  private doFlash(dt: number) {
    if (!this.flashRect) {
      return
    }

    const time = (this.flashTime -= dt)

    if (time <= 0) {
      this.remove(this.flashRect)
      this.flashRect = null

      return
    }

    this.flashRect.alpha = Utils.math.clamp(time / this.flashDuration)
    this.flashRect.pos = Vec.from(this.pos).multiply(-1)
  }

  private doShake(dt: number) {
    if (this.shakePower <= 0) {
      this.shakeLast.set(0, 0)
      return
    }

    this.shakeLast.set(
      Utils.math.randf(-this.shakePower, this.shakePower),
      Utils.math.randf(-this.shakePower, this.shakePower)
    )

    this.pos.add(this.shakeLast)
    this.shakePower -= this.shakeDecay * dt
  }

  private unShake() {
    this.pos.subtract(this.shakeLast)
  }
}
