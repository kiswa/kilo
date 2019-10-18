import { KeyControls } from './key-controls'
import { MouseControls } from './mouse-controls'
import { GamepadControls } from './gamepad-controls'

/**
 * Object containing optional control objects.
 *
 * @category kilo/controls
 */
export interface Controls {
  keys?: KeyControls
  mouse?: MouseControls
  gamepad?: GamepadControls
}
