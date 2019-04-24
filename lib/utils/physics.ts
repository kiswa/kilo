/**
 * @module kilo/utils
 */
import { Vec } from '../types'

/**
 * Interface for properties needed for physics calculations.
 */
export interface VecEntity {
  /** Vector for acceleration. */
  acc: Vec,
  /** Vector for velocity. */
  vel: Vec,
  /** Vector for position. */
  pos: Vec,
  /** Mass to use in calculations. */
  mass: number
}

/**
 * Applies the provided force to the acceleration of the provided VecEntity.
 *
 * @param e VecEntity to set acceleration on.
 * @param force Force to apply to VecEntity.
 */
export function applyForce(e: VecEntity, force: Vec) {
  e.acc.x += force.x / e.mass
  e.acc.y += force.y / e.mass
}

/**
 * Applies the provided friction to the provided VecEntity.
 *
 * @param e VecEntity to apply friction to.
 * @param amount Amount of friction to apply.
 */
export function applyFriction(e: VecEntity, amount: number) {
  const friction = e.vel.clone().multiply(-1).normalize().multiply(amount)
  applyForce(e, friction)
}

/**
 * Applies the provided friction to the provided VecEntity in only the X axis.
 *
 * @param e VecEntity to apply horizontal friction to.
 * @param amount Amount of friction to apply.
 */
export function applyHorizontalFriction(e: VecEntity, amount: number) {
  const friction = e.vel.clone().multiply(-1).normalize().multiply(amount)

  friction.y = 0
  applyForce(e, friction)
}

/**
 * Applies the provided impulse to the provided VecEntity.
 *
 * @param e VecEntity to apply impulse to.
 * @param force Vec to apply as impulse.
 * @param dt Delta time since last update.
 */
export function applyImpulse(e: VecEntity, force: Vec, dt: number) {
  applyForce(e, <Vec>{ x: force.x / dt, y: force.y / dt })
}

/**
 * Integrates acceleration and velocity with delta time.
 *
 * @param e VecEntity to integrate.
 * @param dt Delta time since last update.
 */
export function integrate(e: VecEntity, dt: number) {
  const vx = e.vel.x + e.acc.x * dt
  const vy = e.vel.y + e.acc.y * dt
  const x = (e.vel.x + vx) / 2 * dt
  const y = (e.vel.y + vy) / 2 * dt

  e.vel.set(vx, vy)
  e.acc.set(0, 0)

  return <Vec>{ x, y }
}

/**
 * Integrates the position with delta time.
 *
 * @param e VecEntity to integrate.
 * @param dt Delta time since last update.
 */
export function integratePos (e: VecEntity, dt: number) {
  const dis = integrate(e, dt)
  e.pos.add(dis)

  return dis
}

/**
 * Converts a velocity vector to a speed.
 *
 * @param vel The Vec to convert to a speed.
 */
export function speed(vel: Vec) {
  return Math.sqrt(vel.x * vel.x + vel.y * vel.y)
}
