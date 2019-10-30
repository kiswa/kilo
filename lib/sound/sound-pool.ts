/**
 * @module kilo/sound
 */
import { Sound, SoundOptions } from './sound'

/**
 * A pool of sound objects to allow playing multiples of the same sound.
 *
 * ### Example
 * ```typescript
 * const dings = new SoundPool('assets/sounds/ding.ogg')
 *
 * // When the sound should play (and may already be playing).
 * dings.play()
 * ```
 *
 * @category kilo/sound
 */
export class SoundPool {
  private count: number
  private sounds: Sound[]

  /**
   * Initialize SoundPool object.
   *
   * @param src Source for the sound.
   * @param options Initial options for the sound.
   * @param poolSize Number of sound instances in the pool.
   */
  constructor(src: string, poolSize = 3,
              options: SoundOptions = { volume: 1, loop: false }) {
    this.count = 0
    this.sounds = []

    for (let i = 0; i < poolSize; i++) {
      this.sounds.push(new Sound(src, options))
    }
  }

  /**
   * Play the next sound in the pool.
   *
   * @param overrides Overriding options for the sound.
   */
  play(options?: SoundOptions) {
    const index = this.count++ % this.sounds.length

    this.sounds[index].play(options)
  }

  /**
   * Stop all sounds in the pool.
   */
  stop() {
    for (let i = 0; i < this.sounds.length; i++) {
      this.sounds[i].stop()
    }
  }
}
