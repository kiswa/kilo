/**
 * @module kilo/controls
 */
import { KeyControls } from './key-controls'
import { MouseControls } from './mouse-controls'
import { GamepadControls } from './gamepad-controls'

/**
 * Object containing optional control objects.
 *
 * Used to wrap supported controls for your game.
 *
 * @category kilo/controls
 */
export interface Controls {
  keys?: KeyControls
  mouse?: MouseControls
  gamepad?: GamepadControls
}
