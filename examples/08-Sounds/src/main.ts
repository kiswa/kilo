import { Game, Sound, SoundGroup, SoundPool, KeyControls, Types } from 'kilo/lib'

const game = new Game(320, 240)
const controls = new KeyControls()

let gameType = 'coin'

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

// Although the update loop ensures the sound can't play unless .3 seconds
// have elapsed, it can still cause the existing sound to stop partway through.
// To allow overlapping sounds, use a SoundPool (see below).
const coin = new Sound('../assets/sounds/coin.ogg')
const coinText = new Types.Text('Press A to play coin sound.', {
  font: '20px monospace',
  fill: '#fff'
})

game.scene.add(coinText)

// Change gameType to 'coinPool' to enable the sound pool.
const coinPool = new SoundPool('assets/sounds/coin.ogg')
let lastRun = 0

// Change gameType to 'soundGroup' to enable random sound playing.
const coinGroup = new SoundGroup([
  new Sound('../assets/sounds/coin.ogg'),
  new Sound('../assets/sounds/coin2.ogg'),
  new Sound('../assets/sounds/coin3.ogg'),
])

game.run((dt: number, t: number) => {
  // Kind of cheating here since A is move left by default
  if (controls.x === -1 && t - lastRun > .3) {
    switch (gameType) {
      case 'coin':
        coin.play()
        break

      case 'coinPool':
        coinPool.play()
        break

      case 'coinGroup':
        coinGroup.play()
        break
    }

    lastRun = t
  }
})

