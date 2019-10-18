import { Assets } from './assets'
import { Renderer, CanvasRenderer, WebGLRenderer } from './renderer'
import { Container, Scene } from '.'

/**
 * Function called on each update.
 */
type GameUpdate = (dt: number, t: number) => void

/**
 * Enum of pre-defined speeds for a game.
 * Default game speed is "Normal".
 *
 * Can also be any number, but be careful.
 *
 * @category kilo
 */
export enum Speed {
  Slow = .5,
  Normal = 1,
  Fast = 2
}

/** @hidden */
const STEP = 1 / 60
/** @hidden */
let MULTIPLIER = Speed.Normal
/** @hidden */
let SPEED = STEP / MULTIPLIER
/** @hidden */
const MAX_FRAME = SPEED * 5

/**
 * Contains all aspects of a game.
 *
 * ### Example
 * ```typescript
 * // This is a boring 'game'.
 * const game = new Game(640, 480)
 *
 * game.run()
 * ```
 *
 * @category kilo
 */
export class Game {
  private _width: number
  private _height: number

  private fadeTime: number
  private fadeDuration: number
  private destination: Scene

  private isWebGL: boolean
  private renderer: Renderer
  private _scene: Scene | Container

  /** An [[Assetts]] instance for loading all game assets. */
  static assets: Assets = new Assets()
  /** Whether or not to enable debug display. */
  static debug: boolean = false
  /** Frames per second. */
  static FPS: number = 60
  /** Updates per second. */
  static UPS: number = 60

  /** Gets the width of the game screen. */
  get width() {
    return this._width
  }

  /** Gets the height of the game screen. */
  get height() {
    return this._height
  }

  /** Gets the game scene. */
  get scene() {
    return this._scene
  }

  /**
   * Gets the current speed multiplier of the game.
   * @default Speed.Normal
   */
  get speed() {
    return MULTIPLIER
  }

  /**
   * Sets the speed multiplier of the game.
   */
  set speed(value: Speed | number) {
    MULTIPLIER = value
    SPEED = STEP / MULTIPLIER
  }

  get canvas() {
    return this.renderer.canvasElement
  }

  /**
   * Initialize Game object.
   *
   * @param width Width of the game screen.
   * @param height Height of the game screen.
   * @param container The element to append the canvas to.
   */
  constructor(width: number, height: number, useWebGL: boolean = true,
              container: HTMLElement = document.body) {
    this._width = width
    this._height = height

    const canvas = document.createElement('canvas')
    if (useWebGL) {
      this.checkWebGL(canvas)
    }

    if (useWebGL && this.isWebGL) {
      this.renderer = new WebGLRenderer(width, height, container)
    }

    if (!useWebGL || !this.isWebGL) {
      this.renderer = new CanvasRenderer(width, height, container)
    }
    this._scene = new Container()
    this.destination = null

    this.fadeTime = 0
    this.fadeDuration = 0

    this.logInfo()
  }

  /**
   * Change to a new scene in the game.
   *
   * @param scene The new scene to transition into.
   * @param fadeInSeconds Time in seconds for the transition.
   */
  setScene(scene: Scene, fadeInSeconds = .5) {
    if (!fadeInSeconds) {
      this._scene = scene
      return
    }

    this.destination = scene
    this.fadeTime = fadeInSeconds
    this.fadeDuration = fadeInSeconds
  }

  /**
   * Start the game loop.
   *
   * @param gameUpdate An update function to run for the game.
   */
  run(gameUpdate: GameUpdate = () => {}) {
    let dt = 0
    let last = 0

    let lastTime = window.performance.now()
    let frames = 0
    let updates = 0

    const loop = (ms: number) => {
      const t = ms / 1000

      dt += Math.min(t - last, MAX_FRAME)
      last = t

      while (dt >= SPEED) {
        updates++
        this.scene.update(STEP, t / MULTIPLIER)
        gameUpdate(STEP, t / MULTIPLIER)
        dt -= SPEED
      }

      frames++
      this.renderer.render(this.scene)

      if (Game.debug && window.performance.now() - lastTime >= 1000) {
        Game.FPS = Math.round(.25 * frames + .75 * Game.FPS)
        Game.UPS = Math.round(.25 * updates + .75 * Game.UPS)

        frames = 0
        updates = 0
        lastTime = window.performance.now()
      }

      if (this.fadeTime > 0) {
        const ratio = this.fadeTime / this.fadeDuration

        this.scene.alpha = ratio
        this.destination.alpha = 1 - ratio
        this.renderer.render(this.destination, false)

        if ((this.fadeTime -= STEP) <= 0) {
          this._scene = this.destination
          this.destination = null
        }
      }

      if ((document as any).testRun && frames === 0) {
        return
      }

      window.requestAnimationFrame(loop)
    }

    window.requestAnimationFrame(loop)
  }

  private checkWebGL(canvas: HTMLCanvasElement) {
    let gl = null

    try {
      gl = canvas.getContext('webgl')
    } catch (x) {
      gl = null
    }

    this.isWebGL = gl !== null
  }

  private logInfo() {
    const kilo = `background-color: #fff;
      font-size: 14px;
      color: rebeccapurple;`
    const hearts = `background-color: #fff;
      font-size: 14px;
      color: rebeccapurple;`
    const ver = `background-color: #fff;
      font-size: 14px;
      color: grey;`

    const heartText = '❤' + (this.isWebGL ? '❤' : '')

    console.log(`%ckilo %c${heartText} %cv1.0.0`, kilo, hearts, ver)
  }
}
