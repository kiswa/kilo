/**
 * @module kilo/controls
 */

/**
 * Type to enforce that keys object uses strings as keys, and boolean as values.
 */
type KeyMap = {
  [s: string]: boolean
}

const passThroughKeys = [
  'F5', 'F12'
]

/**
 * Provides access to keyboard inputs.
 *
 * @category kilo/controls
 */
export class KeyControls {
  private keys: KeyMap

  /** Gets status of the spacebar. */
  get action() {
    return this.keys.Space
  }

  /** Sets status of the spacebar. */
  set action(value: boolean) {
    this.keys.Space = value
  }

  /** Gets status of the X key. */
  get actionB() {
    return this.keys.KeyX
  }

  /**
   * Gets x axis input direction.
   *
   * Checks left arrow or A key for left, and right arrow or D key for down.
   */
  get x() {
    let val = 0

    if (this.keys.ArrowLeft || this.keys.KeyA) {
      val -= 1
    }

    if (this.keys.ArrowRight || this.keys.KeyD) {
      val += 1
    }

    return val
  }

  /**
   * Gets y axis input direction.
   *
   * Checks up arrow or W key for up, and down arrow or S key for down.
   */
  get y() {
    let val = 0

    if (this.keys.ArrowUp || this.keys.KeyW) {
      val -= 1
    }

    if (this.keys.ArrowDown || this.keys.KeyS) {
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
      this.keys[e.code] = true

      if (passThroughKeys.indexOf(e.code.toString()) > -1) {
        return
      }

      e.preventDefault()
    }, false)

    document.addEventListener('keyup', e => {
      this.keys[e.code] = false

      if (passThroughKeys.indexOf(e.code.toString()) > -1) {
        return
      }

      e.preventDefault()
    }, false)
  }

  /**
   * Gets or sets the value of a key.
   *
   * @param key KeyboardEvent code for the key (e.g. 'KeyW' for W).
   * @param value If provided, sets the key's value.
   * @returns Whether or not key is 'pressed'.
   */
  key(key: string, value?: boolean) {
    if (value !== undefined) {
      this.keys[key] = value
    }

    return !!this.keys[key]
  }

  /**
   * Resets all keys to 'unpressed' state.
   */
  reset() {
    this.keys = {}
  }
}
