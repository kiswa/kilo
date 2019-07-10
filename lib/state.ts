/**
 * @module kilo
 */

 /**
  * Tracks state as provided, and provides information on status of the current
  * state. Also allows transitioning to a prior state from a temporary state
  * (e.g. a pause dialog back to game play).
  *
  * ### Example
  * ```typescript
  * enum GameState {
  *   Ready,
  *   Playing,
  *   Paused,
  *   GameOver
  * }
  *
  * // In the constructor of whatever needs state.
  * this.state = new State<GameState>(GameState.Ready)
  *
  * // In the update of the scene/object/whatever.
  * this.state.update(dt)
  *
  * switch (this.state) {
  *   case GameState.Ready:
  *     if (this.state.first) {
  *       console.log('First frame of this state')
  *     }
  *
  *     // Go to Playing state after 1.5 seconds
  *     if (this.state.time > 1.5) {
  *       this.state.set(GameState.Playing)
  *     }
  *   break
  *
  *   default:
  *     console.log(this.state.get())
  * }
  * ```
  */
export class State<EnumType> {
  /** Number of seconds in the current state. */
  time: number
  /** Whether this is the first frame of the current state. */
  first: boolean

  private last: EnumType
  private lastTime: number
  private state: EnumType
  private justSetState: boolean

  /**
   * Initialize State object.
   *
   * @param state The initial state to set.
   */
  constructor(state: EnumType) {
    this.set(state)
  }

  /**
   * Return to the previous state (if there is one).
   */
  back() {
    if (this.last === undefined) return

    this.state = this.last
    this.last = null

    this.time = this.lastTime
    this.justSetState = false
  }

  /**
   * Set the current state and store the previous state to allow going back.
   *
   * @param state The new state to change to.
   */
  set(state: EnumType) {
    this.last = this.state
    this.lastTime = this.time || 0

    this.state = state
    this.time = 0
    this.justSetState = true
  }

  /**
   * Get the current state.
   */
  get() {
    return this.state
  }

  /**
   * Update the state.
   *
   * Should be called in parent object's update function.
   *
   * @param dt Delta time since last update.
   */
  update(dt: number) {
    this.first = this.justSetState
    this.time += this.first ? 0 : dt
    this.justSetState = false
  }

  /**
   * Whether the current state is the one provided.
   *
   * @param state State to check for.
   */
  is(state: EnumType) {
    return this.state === state
  }

  /**
   * Whether the current state is one of the provided states.
   * @param states Array of possible states.
   */
  isIn(...states: EnumType[]) {
    let found = false

    for (let i = 0; i < states.length; i++) {
      if (states[i] === this.state) {
        found = true
        break
      }
    }

    return found
  }
}
