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
  private gameMap: TileMap

  vel: Types.Vec
  acc: Types.Vec
  mass: number

  falling: boolean

  constructor(controls: KeyControls, gameMap: TileMap) {
    super(new Types.Texture('assets/images/character.png'), 48, 48)

    this.controls = controls
    this.gameMap = gameMap

    this.hitBox = new Types.HitBox(10, 16, 26, 32)
    this.vel = new Types.Vec()
    this.acc = new Types.Vec()
    this.mass = 1

    this.anims.add('idle', [{ x: 0, y: 0 }], 0)
    this.anims.add('walk', [{ x: 2, y: 0 }, { x: 3, y: 0 }], .2)
    this.anims.add('jump', [{ x: 1, y: 0 }], 0)

    this.anims.play('idle')
  }

  update(dt: number, t: number) {
    super.update(dt, t)
    const { x, action: jump } = this.controls

    if (x) {
      this.scale.x = x
      this.anchor.x = x > 0 ? 0 : this.width
    }

    if (jump && !this.falling) {
      Utils.physics.applyImpulse(this, { x: 0, y: -JUMP_IMPULSE } as any, dt)

      this.falling = true
    }

    if (this.falling) {
      Utils.physics.applyForce(this, { x: 0, y: GRAVITY } as any)
    }

    const changingDirection = (x > 0 && this.vel.x < 0) ||
                              (x < 0 && this.vel.x > 0)

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

    this.anims.play(x ? 'walk' : 'idle')

    const isWalkable = (s: TileSprite) => {
      return s.frame.walkable
    }

    r = Resolvers.wallSlide(this, this.gameMap, r.x, r.y, isWalkable)

    this.pos.add(r)

    const hits = (r as any).hits

    if (hits.down || hits.up) {
      this.vel.y = 0
    }

    if (hits.down) {
      this.falling = false
    }

    if (hits.left || hits.right) {
      this.vel.x = 0
    }
  }
}

