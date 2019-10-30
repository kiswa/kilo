/**
 * @module kilo/sound
 */
import { Sound, SoundOptions } from './sound'
import { math } from '../utils'

/**
 * Plays a random sound from an array of sounds.
 *
 * ### Example
 * ```typescript
 * const ding = new SoundGroup([
 *   new Sound('assets/sounds/ding1.ogg'),
 *   new Sound('assets/sounds/ding2.ogg'),
 *   new Sound('assets/sounds/ding3.ogg'),
 *   new Sound('assets/sounds/ding4.ogg')
 * ])
 *
 * // When one of the sounds should play.
 * ding.play()
 * ```
 *
 * @category kilo/sound
 */
export class SoundGroup {
  private sounds: Sound[]

  /**
   * Initialize SoundGroup object.
   *
   * @param sounds Array of sounds to select from on play.
   */
  constructor(sounds: Sound[]) {
    this.sounds = sounds
  }

  /**
   * Play a random sound from the group.
   *
   * @param opts Overriding options for the sound.
   */
  play(opts?: SoundOptions) {
    math.randOneFrom(this.sounds).play(opts)
  }

  /**
   * Stop all sounds from playing.
   */
  stop() {
    for (let i = 0; i < this.sounds.length; i++) {
      this.sounds[i].stop()
    }
  }
}
