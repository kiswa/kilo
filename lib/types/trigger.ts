import { HitBox, Rect, Sprite } from '.'

/**
 * An area that invokes callbacks when an object enters and/or exits
 * (as determined by collision check).
 *
 * ### Example
 * ```typescript
 * const door = new Trigger(
 *   new HitBox(0, 0, 10, 10),
 *   () => { console.log('Trigger entered.') },
 *   () => { console.log('Trigger exited.') }
 * )
 *
 * // In collision checks.
 * if (sprite.hit(player, door)) {
 *   if (doorEntered) {
 *     return
 *   }
 *
 *   doorEntered = true
 *   door.onEnter()
 *
 *   return
 * }
 *
 * if (doorEntered) {
 *   doorEntered = false
 *   door.onExit()
 * }
 * ```
 *
 * @category kilo/types
 */
export class Trigger extends Sprite {
  private _onEnter: Function
  private _onExit: Function

  /**
   * Initialize Trigger object.
   *
   * @param hitBox The hitbox to use for the trigger.
   * @param onEnter Callback used when the trigger is entered.
   * @param onExit Callbak used when the trigger is exited.
   * @param debug Whether to display a debug rectangle for the trigger.
   */
  constructor(hitBox: HitBox, onEnter: Function,
              onExit: Function, debug = false) {
    super(null)

    this.hitBox.set(hitBox.x, hitBox.y, hitBox.width, hitBox.height)

    this._onEnter = onEnter
    this._onExit = onExit

    this.debug = debug
  }

  /** Sets the debug state. */
  set debug(val: boolean) {
    if (!val) {
      this.children.pop()
      return
    }

    this.children.push(new Rect(this.hitBox.width,
                                this.hitBox.height,
                                { fill: 'rgba(255, 255, 0, .5)' }))
  }

  onEnter(...args: any): any {
    this._onEnter(...args)
  }

  onExit(...args: any): any {
    this._onExit(...args)
  }
}
