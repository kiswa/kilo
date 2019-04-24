/**
 * @module kilo/controls
 */

 /**
  * Simplifies working with the
  * [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API).
  */
export class GamepadControls {
  /**
   * Deadzone threshold.
   * @default 0.21
   */
  threshold: number

  private controller: Gamepad
  private controllers: Array<Gamepad>

  /** Gets status of A button (or equivalent). */
  get actionA() {
    return this.action(0, 11)
  }

  /** Gets status of B button (or equivalent). */
  get actionB() {
    return this.action(1, 12)
  }

  /** Gets status of X button (or equivalent). */
  get actionX() {
    return this.action(2, 13)
  }

  /** Gets status of Y button (or equivalent). */
  get actionY() {
    return this.action(3, 14)
  }

  /** Gets status of Escape-equivalent button. */
  get actionEsc() {
    return this.action(4)
  }

  /** Gets direction of x axis. */
  get x() {
    return this.axis(0)
  }

  /** Gets direction of y axis. */
  get y() {
    return this.axis(1)
  }

  /**
   * Initialize GamepadControls object.
   */
  constructor() {
    this.controller = null
    this.controllers = []
    this.threshold = .21

    window.addEventListener('gamepadconnected',
      (e: GamepadEvent) => this.handler(e, true),
      false)

    window.addEventListener('gamepaddisconnected',
      (e: GamepadEvent) => this.handler(e),
      false)
  }

  private handler(e: GamepadEvent, isConnect = false) {
    const { gamepad } = e

    if (!isConnect) {
      delete this.controllers[gamepad.index]
      this.controller = null
      return
    }

    this.controllers[gamepad.index] = gamepad
    this.controller = gamepad
  }

  private axis(id: number) {
    if (!this.controller) {
      return 0
    }

    return (this.controller.axes[id] < -this.threshold)
      ? -1
      : (this.controller.axes[id] > this.threshold)
        ? 1
        : 0
  }

  private action(...buttons: Array<number>) {
    if (!this.controller) {
      return false
    }

    for (let i = 0; i < buttons.length; i++) {
      for (let j = 0; j < this.controller.buttons.length; j++) {
        const button = this.controller.buttons[buttons[i]]
        if (button && button.pressed) {
          return true
        }
      }
    }

    return false
  }

}
