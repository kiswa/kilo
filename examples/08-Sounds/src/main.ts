import { Game, Sound, SoundGroup, SoundPool, KeyControls, Types } from 'kilo/lib'

const game = new Game(320, 240)
const controls = new KeyControls()

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

// Although the update loop ensures the sound can't play unless .3 seconds
// have elapsed, it can still cause the existing sound to stop partway through.
// To allow overlapping sounds, use a SoundPool (see below).
const coin = new Sound('../assets/sounds/coin.ogg')

const coinTextA = new Types.Text('Press A to play coin sound.', {
  font: '14px monospace',
  fill: '#fff'
})

const coinTextS = new Types.Text('Press S to play coin sound from pool.', {
  font: '14px monospace',
  fill: '#fff'
})

const coinTextD = new Types.Text('Press D to play coin sound from group.', {
  font: '14px monospace',
  fill: '#fff'
})

coinTextS.pos.y = 20
coinTextD.pos.y = 40

game.scene.add(coinTextA)
game.scene.add(coinTextS)
game.scene.add(coinTextD)

const coinPool = new SoundPool('assets/sounds/coin.ogg')
let lastRun = 0

const coinGroup = new SoundGroup([
  new Sound('../assets/sounds/coin.ogg'),
  new Sound('../assets/sounds/coin2.ogg'),
  new Sound('../assets/sounds/coin3.ogg'),
])

game.run((dt: number, t: number) => {
  if (controls.key('KeyA') && t - lastRun > .3) {
    coin.play()
    lastRun = t
  }

  if (controls.key('KeyS')) {
    coinPool.play()
  }

  if (controls.key('KeyD')) {
    coinGroup.play()
  }
})

