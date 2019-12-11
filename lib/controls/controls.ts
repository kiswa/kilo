import { KeyControls } from './key-controls'
import { MouseControls } from './mouse-controls'
import { GamepadControls } from './gamepad-controls'

/**
 * Object containing optional control objects.
 *
 * Used to wrap supported controls for your game.
 *
 * ### Example
 * ```typescript
 // For a game with keyboard and gamepad controls
 const scene = new Scene(game, {
   keys: new KeyControls(),
   gamepad: new GamepadControls()
 })
 ```
 */
export interface Controls {
  /** Key controls to be used if provided. */
  keys?: KeyControls
  /** Mouse controls to be used if provided. */
  mouse?: MouseControls
  /** Gamepad controls to be used if provided. */
  gamepad?: GamepadControls
}
