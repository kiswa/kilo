import { TileSprite, Types, KeyControls, Utils, Resolvers, TileMap } from 'kilo/lib'

const GRAVITY = 2900
const STEER_FORCE = 2000
const FRICTION_GROUND = 1800

const JUMP_IMPULSE = 780
const JUMP_WALL_IMPULSE = 500
const JUMP_FORGIVENESS = .08
const JUMP_WALL_FORGIVENESS = .4

const MAX_VEL = 300
const MIN_VEL = 200

export class Player extends TileSprite {
  private controls: KeyControls

  vel: Types.Vec
  acc: Types.Vec
  mass: number

  constructor(controls: KeyControls, gameMap: TileMap) {
    super(new Types.Texture('assets/images/character.png'), 48, 48)

    this.controls = controls

    this.vel = new Types.Vec()
    this.acc = new Types.Vec()
    this.mass = 1

    this.anims.add('idle', [{ x: 0, y: 0 }], 0)
    this.anims.add('walk', [{ x: 2, y: 0 }, { x: 3, y: 0 }], .2)
    this.anims.add('jump', [{ x: 1, y: 0 }], 0)

    this.anims.play('idle')
  }

  update(dt: number, _: number) {
    const { x, y, action: jump } = this.controls

    if (jump) {
      // TODO
    }

    const changingDirection = (x > 0 && this.vel.x < 0) ||
                              (x < 0 && this.vel.y > 0)

    if (x !== 0 && Math.abs(this.vel.x) < MIN_VEL) {
      Utils.physics.applyForce(this, { x: x * STEER_FORCE * 2, y: 0 } as any)
    } else if (changingDirection || (x && this.vel.mag() < MAX_VEL)) {
      Utils.physics.applyForce(this, { x: x * STEER_FORCE, y: 0 } as any)
    }

    Utils.physics.applyHorizontalFriction(this, FRICTION_GROUND)

    let r = Utils.physics.integrate(this, dt)

    if (this.vel.mag() <= 15) {
      this.vel.set(0, 0)
    }

    r = Resolvers.wallSlide()
  }
}

