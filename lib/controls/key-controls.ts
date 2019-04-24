/**
 * @module kilo/controls
 */

 /**
  * Provides access to keyboard inputs.
  */
export class KeyControls {
  private keys: Array<boolean>

  /** Gets status of the spacebar. */
  get action() {
    return this.keys[32] // Spacebar
  }

  /** Sets status of the spacebar. */
  set action(value: boolean) {
    this.keys[32] = value
  }

  /** Gets status of the X key. */
  get actionB() {
    return this.keys[88] // X key
  }

  /**
   * Gets x axis input direction.
   *
   * Checks up arrow or W key for up, and down arrow or S key for down.
   */
  get x() {
    let val = 0

    // Left arrow or A key
    if (this.keys[37] || this.keys[65]) {
      val -= 1
    }

    // Right arrow or D key
    if (this.keys[39] || this.keys[68]) {
      val += 1
    }

    return val
  }

  /**
   * Gets y axis input direction.
   *
   * Checks left arrow or A key for left, and right arrow or D key for down.
   */
  get y() {
    let val = 0

    // Up arrow or W key
    if (this.keys[38] || this.keys[87]) {
      val -= 1
    }

    // Down arrow or S key
    if (this.keys[40] || this.keys[83]) {
      val += 1
    }

    return val
  }

  /**
   * Initialize KeyControls object.
   */
  constructor() {
    this.reset()

    document.addEventListener('keydown', e => {
      if ([37, 38, 39, 40, 32].indexOf(e.which) >= 0) {
        e.preventDefault()
      }

      this.keys[e.which] = true
    }, false)

    document.addEventListener('keyup', e => {
      this.keys[e.which] = false
    }, false)
  }

  /**
   * Gets or sets the value of a key.
   *
   * @param key ASCII code for keyboard key (e.g. 40 is down arrow).
   * @param value If provided, sets the key's value.
   * @returns Whether or not key is 'pressed'.
   */
  key(key: number, value?: boolean) {
    if (value !== undefined) {
      this.keys[key] = value
    }

    return this.keys[key]
  }

  /**
   * Resets all keys to 'unpressed' state.
   */
  reset() {
    this.keys = []
  }
}
