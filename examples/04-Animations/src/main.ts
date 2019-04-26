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

npc.pos.set(32, 32)
npc2.pos.set(128, 32)

game.scene.add(npc)
game.scene.add(npc2)

game.run()

