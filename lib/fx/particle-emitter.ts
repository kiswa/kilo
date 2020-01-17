import { Container, TileSprite } from '../'
import { Rect, Vec } from '../types'
import { Particle, ParticleOptions } from './particle'

/**
 * Container which manages a pool of {@link Particle} objects (20 by default)
 * and emits them in random directions when the `play` method is called.
 */
export class ParticleEmitter extends Container {
  private particles: Particle[]
  private lastPlay: number

  /**
   * Initialize ParticleEmitter object.
   *
   * @param numParticles The number of particles used.
   * @param display TileSprite (or Rect) to use for display.
   * @param options Options affecting particle behaviors.
   * See ParticleOptions for default values if not passed in.
   */
  constructor(numParticles = 20, display?: TileSprite | Rect,
              options?: ParticleOptions) {
    super()

    this.particles = []

    for (let i = 0; i < numParticles; i++) {
      this.particles.push(this.add(
        new Particle(display, options)
      ))
    }

    this.lastPlay = 0
  }

  /**
   * 'Plays' the particle emitter effect.
   *
   * @param pos Position to use for anchoring particles.
   */
  play(pos: Vec) {
    const now = Date.now()

    if (now - this.lastPlay < 300) return
    this.lastPlay = now

    this.pos.copy(pos)

    for (let particle of this.particles) {
      particle.reset()
    }
  }
}
