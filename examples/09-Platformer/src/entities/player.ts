import {
  TileSprite,
  Types,
  KeyControls,
  Utils,
  Resolvers,
  TileMap,
} from 'kilo/lib'

/* These values should be tailored to the game experience */
const GRAVITY = 2900
const STEER_FORCE = 2000
const FRICTION_GROUND = 1800

const JUMP_IMPULSE = 780
const JUMP_FORGIVENESS = .08

const MAX_VEL = 300
const MIN_VEL = 200
/*                                                        */

export class Player extends TileSprite {
  private controls: KeyControls
  private gameMap: TileMap
  private debugText: Types.Text

  private _hasKey: boolean

  vel: Types.Vec
  acc: Types.Vec
  mass: number

  paused: boolean
  releasedAction: boolean
  falling: boolean
  fallingTimer: number

  get hasKey() {
    return this._hasKey
  }

  constructor(controls: KeyControls, gameMap: TileMap) {
    super(new Types.Texture('assets/images/character.png'), 48, 48)

    this.controls = controls
    this.gameMap = gameMap

    this.hitBox = new Types.HitBox(10, 16, 26, 32)
    this.vel = new Types.Vec()
    this.acc = new Types.Vec()
    this.mass = 1

    this.paused = false
    this.releasedAction = false
    this.falling = false
    this.fallingTimer = 0

    this.anims.add('idle', [{ x: 0, y: 0 }], 0)
    this.anims.add('walk', [{ x: 2, y: 0 }, { x: 3, y: 0 }], .2)
    this.anims.add('jump', [{ x: 1, y: 0 }], 0)

    this.anims.play('idle')

    const center = Utils.sprite.center(this)
    this.pivot.copy(center)

    this.debugText = this.add(new Types.Text('', {
      fill: '#333',
      font: '14px monospace',
      align: 'center'
    }))
  }

  onDeath() {}

  addKey() {
    this._hasKey = true

    const key = this.add(new TileSprite(
      new Types.Texture('assets/images/tilesheet.png'), 32, 32
    ))

    key.frame.set(8, 4)
    key.pos.set(6, -10)

    console.log(this.children)
  }

  update(dt: number, t: number) {
    super.update(dt, t)

    if (this.paused) {
      return
    }

    this.debugText.text = `Children: ${this.hasChildren} Pos: ${this.pos}`

    const { x, action: jump } = this.controls

    this.keepInMap()
    this.flipIfNeeded(x)
    this.handleJumpAndFall(jump, dt)

    let vec = this.handleMovement(x, dt)
    let isJumpthrough = false

    const isWalkable = (s: TileSprite, i: number) => {
      if (s.frame.type === 'jumpthrough') {
        isJumpthrough = true

        // Only allow jumping through if it's one of
        // the first two tiles (which are above the player)
        return i < 2 ? true : !this.falling
      }

      return s.frame.walkable
    }

    const res = Resolvers.wallSlide(this, this.gameMap, vec.x, vec.y, isWalkable)

    this.pos.add(Types.Vec.from(res as any))
    this.handleCollisions(res, isJumpthrough, dt)
  }

  private handleCollisions(r: any, isJumpthrough: boolean, dt: number) {
    const { hits } = r
    const bounds = Utils.sprite.bounds(this)

    if (hits.up) {
      this.stopIfNotJumpthrough(bounds)
    }

    if (hits.down) {
      const tile = this.gameMap.tileAtPixelPos(new Types.Vec(
        this.pos.x + this.hitBox.x, this.pos.y + this.height
      ))

      if (tile.frame.type === 'death') {
        this.dead = true
        this.onDeath()
      }
    }

    if (hits.down && !hits.up) {
      this.falling = false
      this.vel.y = 0
    }

    if ((!isJumpthrough && !this.falling) && (hits.left || hits.right)) {
      this.vel.x = 0
    }

    if (!this.falling && !hits.down) {
      this.handleFalling(bounds, dt)
    }
  }

  private handleFalling(bounds: Types.HitBox, dt: number) {
      const leftFoot = this.gameMap.pixelToMapPos({
        x: bounds.x,
        y: bounds.y + bounds.height + 1
      } as Types.Vec)

      const rightFoot = this.gameMap.pixelToMapPos({
        x: bounds.x + bounds.width,
        y: bounds.y + bounds.height + 1
      } as Types.Vec)

      const left = this.gameMap.tileAtMapPos(leftFoot)
      const right = this.gameMap.tileAtMapPos(rightFoot)

      if (left.frame.walkable && right.frame.walkable) {
        if (this.fallingTimer <= 0) {
          this.fallingTimer = JUMP_FORGIVENESS
        } else if ((this.fallingTimer -= dt) <= 0) {
          this.falling = true
        }
      }
  }

  private stopIfNotJumpthrough(bounds: Types.HitBox) {
      const topLeft = this.gameMap.pixelToMapPos({
        x: bounds.x,
        y: bounds.y - 1
      } as Types.Vec)

      const topRight = this.gameMap.pixelToMapPos({
        x: bounds.x + bounds.width,
        y: bounds.y - 1
      } as Types.Vec)

      const tileLeft = this.gameMap.tileAtMapPos(topLeft)
      const tileRight = this.gameMap.tileAtMapPos(topRight)

      if (tileLeft.frame.type !== 'jumpthrough'
          && tileRight.frame.type !== 'jumpthrough') {
        this.vel.y = 0
      }
  }

  /**
   * Handles x movements, applying friction and steering forces
   * Also sets the animation if walking or idling
   */
  private handleMovement(x: number, dt: number) {
    const changingDirection = (x > 0 && this.vel.x < 0) ||
                              (x < 0 && this.vel.x > 0)

    if (x !== 0 && Math.abs(this.vel.x) < MIN_VEL) {
      Utils.physics.applyForce(this, {
        x: x * STEER_FORCE * 2,
        y: 0
      } as any)
    } else if (changingDirection || (x && this.vel.mag() < MAX_VEL)) {
      Utils.physics.applyForce(this, {
        x: x * STEER_FORCE,
        y: 0
      } as any)
    }

    Utils.physics.applyHorizontalFriction(this, FRICTION_GROUND)

    let vec = Utils.physics.integrate(this, dt)

    if (this.vel.mag() <= 15) {
      this.vel.set(0, 0)
    }

    this.anims.play(x ? 'walk' : 'idle')

    return vec
  }

  /** Apply physics for either jumping or falling */
  private handleJumpAndFall(jump: boolean, dt: number) {
    if (!jump) {
      this.releasedAction = true
    }

    if (jump && !this.falling) {
      Utils.physics.applyImpulse(this, { x: 0, y: -JUMP_IMPULSE } as any, dt)
      this.falling = true
    }

    if (this.falling) {
      Utils.physics.applyForce(this, { x: 0, y: GRAVITY } as any)
    }
  }

  /** Set the scale and anchor points based on facing direction */
  private flipIfNeeded(x: number) {
    if (!x) {
      return
    }

    this.scale.x = x
    this.anchor.x = x > 0 ? 0 : this.width
  }

  /** Prevent the player from moving outside the map boundaries */
  private keepInMap() {
    const width = this.gameMap.mapWidth * this.gameMap.tileWidth
    const height = this.gameMap.mapHeight * this.gameMap.tileHeight

    if (this.pos.x < -3) {
      this.pos.x = -3
      this.vel.x = 0
    }

    if (this.pos.x > width + 3 - this.width) {
      this.pos.x = width + 3 - this.width
      this.vel.x = 0
    }

    if (this.pos.y < -3) {
      this.pos.y = -3
      this.vel.y = 0
    }

    if (this.pos.y > height) {
      this.pos.y = height
      this.vel.y = 0
    }
  }
}

