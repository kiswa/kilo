/**
 * @module kilo
 */
import { Container, Game } from '.'
import { Controls } from './controls/controls'

/**
 * A unique [[Container]] with a reference to the game and controls,
 * and a callback for the completion of the scene.
 *
 * To be implemented as your unique scenes.
 *
 * @category kilo
 */
export abstract class Scene extends Container {
  /** The game object. */
  game: Game
  /** The game controls to be used. */
  controls: Controls
  /** Function to call when the scene is completed. */
  onSceneComplete: Function

  /**
   * Initialize Scene object.
   *
   * @param game Reference to the game.
   * @param onSceneComplete Function to call on scene completion.
   * @param controls Object with possible controls.
   */
  constructor(game: Game, onSceneComplete: Function, controls?: Controls) {
    super()

    this.game = game
    this.controls = controls

    this.onSceneComplete = onSceneComplete
  }
}
