import { Game, Types } from 'kilo/lib'

const tileSize = 48
const game = new Game(tileSize * 13, tileSize * 10)

let elapsed = 0

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const hello = new Types.Text('', {
  font: '50px monospace',
  fill: '#efefef',
  align: 'center'
})
hello.pos.set(game.width / 2, game.height / 2 - 25)

game.scene.add(hello)

game.run((dt: number, t: number) => {
  elapsed += dt

  hello.text = 'Hello World' + ((Math.floor(elapsed) % 2) ? '.' : '!')

  hello.pos.x += Math.cos(t) * .25
  hello.pos.y += Math.sin(t) * .25
})

