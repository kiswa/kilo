import { Vec } from './../types'

/**
 * @ignore
 */
let seed = 42
/**
 * @ignore
 */
let random = Math.random

/**
 * Gets the angle from one Vec to another.
 *
 * @param a Vec to get angle from.
 * @param b Vec to get angle to.
 */
export function angle(a: Vec, b: Vec) {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.atan2(dy, dx)
}

/**
 * Gets a direction Vec to the provided angle.
 *
 * @param angle An angle in radians.
 */
export function dirTo(angle: number) {
  return new Vec(Math.cos(angle), Math.sin(angle))
}

/**
 * Clamps a number to fall between min and max values.
 *
 * @param {number} x Value to be clamped.
 * @param min Minimum allowed value.
 * @param max Maximum allowed value.
 */
export function clamp(x: number, min = 0, max = 1) {
  return Math.max(min, Math.min(x, max))
}

/**
 * Gets the distance between to Vecs.
 *
 * @param a Vec to get distance from.
 * @param b Vec to get distance to.
 */
export function distance(a: Vec, b: Vec) {
  const dx = a.x - b.x
  const dy = a.y - b.y

  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Simple gaussian implementation.
 *
 * @param x Number to apply gauss to.
 */
export function gauss(x: number) {
  return Math.exp(-x * x)
}

/**
 * Simple gaussian distance.
 *
 * @param x Number to apply gauss to.
 * @param center Number representing center.
 * @param dist Number represeting distance.
 */
export function gaussDistance(x: number, center: number, dist: number) {
  return gauss((x - center) / dist)
}

/**
 * Simple linear interpolation.
 *
 * @param x Number to interpolate from.
 * @param min Minimum interpolation value.
 * @param max Maximum interpolation value.
 */
export function lerp(x: number, min = 0, max = 1) {
  return (x - min) / (max - min)
}

/**
 * Simple bayesian inference implementation.
 *
 * @param min Minimum number to mix.
 * @param max Maximum number to mix.
 * @param p Number to mix.
 */
export function mix(min: number, max: number, p: number) {
  return min * (1 - p) + max * p
}

/**
 * Returns a random whole number in the provided range.
 *
 * @param min Minimum random value.
 * @param max Maximum random value.
 */
export function rand(min = 0, max?: number) {
  return Math.floor(randf(min, max))
}

/**
 * Returns a random number in the provided range.
 *
 * @param min Minimum random value.
 * @param max Maximum random value.
 */
export function randf(min: number, max?: number) {
  if (max === null || max === undefined) {
    max = min || 1
    min = 0
  }

  return random() * (max - min) + min
}

/**
 * Returns a random item from an array.
 *
 * @param items Array of items to select from.
 */
export function randOneFrom(items: any[]) {
  return items[rand(items.length)]
}

/**
 * Returns a boolean with a probability for true of 1 in the provided max.
 *
 * @param max Maximum random value
 */
export function randOneIn(max = 2) {
  return rand(0, max) === 0
}

/**
 * Sets the seed value for random number generation.
 *
 * @param s Seed value to use for random numbers.
 */
export function randomSeed(s?: number) {
  if  (!isNaN(s)) {
    seed = s
  }

  return seed
}

/**
 * Sets whether or not to use the seeded random number generator.
 *
 * @param useSeeded If seeded random number generator should be used.
 */
export function useSeededRandom(useSeeded = true) {
  randomSeeded()

  random = useSeeded ? randomSeeded : Math.random
}

/**
 * Easing function to provide a smooth step in value changes.
 *
 * @param value Value to step.
 * @param min Minimum interpolation value.
 * @param max Maximum interpolation value.
 */
export function smoothStep(value: number, min = 0, max = 1) {
  const x = clamp(lerp(value, min, max))

  return x * x * (3 - 2 * x)
}

/**
 * @ignore
 */
function randomSeeded() {
  const maxInt32 = 2147483647
  const cpp11Mult = 48271

  seed = (seed * cpp11Mult + 0) % maxInt32

  return seed / maxInt32
}

/** A collection of easing functions. */
export const ease = {
  quadIn(x: number) {
    return x * x
  },

  quadOut(x: number) {
    return 1 - this.quadIn(1 - x)
  },

  cubicIn(x: number) {
    return x * x * x
  },

  cubicOut(x: number) {
    return 1 - this.cubicIn(1 - x)
  },

  cubicInOut(x: number) {
    if (x < .5) return this.cubicIn(x * 2) / 2

    return 1 - this.cubicIn((1 - x) * 2) / 2
  },

  elasticOut(x: number) {
    const p = 0.4

    return Math.pow(2, -10 * x) * Math.sin((x - p / 4) * (Math.PI * 2) / p) + 1
  }
}
