/**
 * @packageDocumentation
 * @module kilo
 */
import { Game } from '.'

/** Function that is called when an asset is ready. */
type ReadyCallback = () => void

/** Function that is called to provide progress status. */
type ProgressCallback = (complete: number, total: number) => void

/**
 * Loads assets for use in a game.
 *
 * Assets are cached by URI to prevent multiple network calls for the same asset.
 */
export class Assets {
  private cache: any
  private readyListeners: ReadyCallback[]
  private progressListeners: ProgressCallback[]
  private isCompleted: boolean

  private total: number
  private remaining: number

  /** Get completed status of all assets. */
  get completed() {
    return this.isCompleted
  }

  /** Initialize Assets object. */
  constructor() {
    this.cache = {}
    this.readyListeners = []
    this.progressListeners = []
    this.isCompleted = false

    this.total = 0
    this.remaining = 0
  }

  /**
   * Allows listeners to provide a callback for asset load completion.
   *
   * @param cb Function called when all assets are loaded.
   */
  onReady(cb: ReadyCallback) {
    if (this.isCompleted) {
      return cb()
    }

    this.readyListeners.push(cb)

    if (this.remaining === 0) {
      this.done()
    }
  }

  /**
   * Allows listeners to provide a callback for asset load progress.
   *
   * @param cb Function called when a single asset is loaded.
   */
  onProgress(cb: ProgressCallback) {
    this.progressListeners.push(cb)
  }

  /**
   * Loads an image asset.
   *
   * @param url Relative path to image file.
   */
  image(url: string): HTMLImageElement {
    const factory = (url: string) => {
      const img = new Image()

      img.src = url
      img.addEventListener('load', e => this.onAssetLoad(e), false)

      return img
    }

    return this.load(url, factory)
  }

  /**
   * Loads a sound asset.
   *
   * @param url Relative path to sound file.
   */
  sound(url: string): HTMLAudioElement {
    const factory = (url: string) => {
      const onLoad = (e: Event) => {
        audio.removeEventListener('canplay', onLoad)
        this.onAssetLoad(e)
      }

      const audio = new Audio(url)
      audio.addEventListener('canplay', onLoad, false)

      return audio
    }

    return this.load(url, factory)
  }

  /**
   * Loads a JSON asset and returns parsed object.
   *
   * @param url Relative path to JSON asset.
   */
  json(url: string) {
    const factory = async (url: string) => {
      return await fetch(url)
        .then(res => res.json())
        .then(json => this.onAssetLoad(json, true))
        .catch(e => Game.debug && console.error(e))
    }

    return this.load(url, factory, true)
  }

  private done() {
    this.isCompleted = true

    for (let i = 0; i < this.readyListeners.length; i++) {
      this.readyListeners[i]()
    }
  }

  private onAssetLoad(asset: any, isJson = false) {
    if (this.isCompleted || isJson) {
      return asset
    }

    this.remaining--
    for (let i = 0; i < this.progressListeners.length; i++) {
      this.progressListeners[i](this.total - this.remaining, this.total)
    }

    if (this.remaining === 0) {
      this.done()
    }
  }

  private load(url: string, factory: (url: string) => any, isJson = false) {
    if (this.cache[url]) {
      Game.debug && console.info(`cached ${url}`)
      return this.cache[url]
    }

    Game.debug && console.info(`load ${url}`)

    this.remaining++
    this.total++

    const asset = factory(url)
    this.cache[url] = asset

    this.onAssetLoad(asset, isJson)

    return asset
  }
}
