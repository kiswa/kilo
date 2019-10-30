import { Game, TileSprite, Types } from 'kilo/lib'

const game = new Game(320, 240)

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const texture = new Types.Texture('assets/images/npc.png')
const npc = new TileSprite(texture, 40, 55)
const npc2 = new TileSprite(texture, 40, 55)

// Name the animation, provide an array of points for the frames,
// and provide time between frames (seconds). Then play the animation.
npc.anims.add('walk', [0, 1].map(x => ({ x, y: 0 } as any)), .25)
npc.anims.play('walk')

npc2.anims.add('walk', [0, 1].map(x => ({ x, y: 0 } as any)), .1)
npc2.anims.play('walk')

npc.pos.set(0, 32)
npc2.pos.set(128, 62)

// Create hitbox starting at point (6, 6) with width of 18px and height of 49px
npc.hitBox.set(6, 6, 24, 49)
npc2.hitBox.set(6, 6, 24, 49)

game.scene.add(npc)
game.scene.add(npc2)

game.run((dt: number, _: number) => {
  npc.pos.x += (npc.scale.x * dt * 100)
  npc2.pos.x += (npc2.scale.x * dt * 200)

  if (npc.pos.x + npc.hitBox.x <= 0) {
    npc.anchor.x = 0
    npc.scale.x = 1
  }

  if (npc.pos.x + npc.hitBox.x + npc.hitBox.width >= game.width) {
    npc.anchor.x = npc.width
    npc.scale.x = -1
  }

  if (npc2.pos.x + npc2.hitBox.x <= 0) {
    npc2.anchor.x = 0
    npc2.scale.x = 1
  }

  if (npc2.pos.x + npc2.hitBox.x + npc2.hitBox.width >= game.width) {
    npc2.anchor.x = npc2.width
    npc2.scale.x = -1
  }
})

