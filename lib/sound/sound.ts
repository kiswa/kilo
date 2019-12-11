import { Assets } from '../assets'

/** Options for a Sound object. */
export interface SoundOptions {
  /** Volume of the sound (from 0 to 1). */
  volume: number,
  /** Whether or not the sound loops. */
  loop: boolean
}

/**
 * Provides sounds for your game!
 *
 * ### Example
 * ```typescript
const ding = new Sound('assets/sounds/ding.ogg')

// When the sound should play.
ding.play()
```
 */
export class Sound {
  /** Whether or not the sound is currently playing. */
  playing: boolean

  private options: SoundOptions
  private audio: HTMLAudioElement

  /** Gets the current volume setting. */
  get volume() {
    return this.audio.volume
  }

  /** Sets the volume of the sound. */
  set volume(volume) {
    this.options.volume = this.audio.volume = volume
  }

  /**
   * Initialize Sound object.
   *
   * @param src Source for the sound.
   * @param options Initial options for the sound.
   */
  constructor(src: string, options: SoundOptions = { volume: 1, loop: false }) {
    this.playing = false
    this.options = options

    const assets = new Assets()
    const audio = assets.sound(src)

    audio.loop = options.loop

    audio.addEventListener('error', () => {
      throw Error(`Error loading audio: ${src}`)
    }, false)

    audio.addEventListener('ended', () => {
      this.playing = false
    }, false)

    this.audio = audio
  }

  /**
   * Play the sound from the beginning.
   *
   * @param overrides Overriding options for the sound.
   */
  play(overrides?: SoundOptions) {
    const opts = Object.assign({ time: 0 }, this.options, overrides)

    this.audio.volume = opts.volume
    this.audio.currentTime = opts.time

    this.audio.play()
    this.playing = true
  }

  /** Stop the sound from playing. */
  stop() {
    this.audio.pause()
    this.playing = false
  }
}
