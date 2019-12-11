/**
 * Provides support for playing sounds using the
 * [Web Audio API]{@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API}.
 *
 * ```typescript
const audio = new WebAudio('assets/sounds/theme.ogg')

if (!audio.hasWebAudio) {
  // Do something else for sounds.
}

audio.master.value = .3 // Low volume
audio.play()
```
 */
export class WebAudio {
  /** Whether or not WebAudio is supported. */
  hasWebAudio = !!((window as any).AudioContext || (window as any).webkitAudioContext)

  private element: HTMLAudioElement
  private context: AudioContext
  private masterNode: GainNode
  private sfxNode: GainNode
  private musicNode: GainNode

  /** Gets the audio context. */
  get ctx() {
    return this.context
  }

  /** Gets the master node. */
  get master() {
    return this.masterNode
  }

  /** Gets the sound effects node. */
  get sfx() {
    return this.sfxNode
  }

  /** Gets the music node. */
  get music() {
    return this.musicNode
  }

  /**
   * Initialize WebAudio instance.
   *
   * @param src The source for the audio element.
   */
  constructor(src: string) {
    if (!this.hasWebAudio) {
      return
    }

    this.element = document.createElement('audio')
    this.element.src = src
    this.context = new AudioContext()

    this.masterNode = this.context.createGain()
    this.master.gain.value = 1
    this.master.connect(this.context.destination)

    this.sfxNode = this.context.createGain()
    this.sfx.gain.value = 1
    this.sfx.connect(this.master)

    this.musicNode = this.context.createGain()
    this.music.gain.value = 1
    this.music.connect(this.master)
  }

  /** Plays the audio element. */
  play() {
    this.element.play()
  }

  /** Pauses the audio element. */
  stop() {
    this.element.pause()
  }

  /** Mutes the master node. */
  mute() {
    this.masterNode.gain.setValueAtTime(0, this.context.currentTime)
  }

  /** Fades out playing sounds. */
  fadeOut() {
    const volume = this.masterNode.gain.value

    this.masterNode.gain.setValueAtTime(volume, this.context.currentTime)
    this.masterNode.gain.linearRampToValueAtTime(0, this.context.currentTime + .4)
  }
}
