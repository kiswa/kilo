import { Game, Types } from 'kilo/lib'

const tileSize = 16
const game = new Game(tileSize * 13, tileSize * 10)

// Uncomment below line to show FPS & UPS counters
// Game.debug = true

const texLeft = new Types.Texture('../assets/images/banner-left.png')
const texCenter = new Types.Texture('../assets/images/banner-center.png')
const texRight = new Types.Texture('../assets/images/banner-right.png')

const banner = [
  new Types.Sprite(texLeft),
  new Types.Sprite(texCenter),
  new Types.Sprite(texRight),
]

const longerBanner = [
  new Types.Sprite(texLeft),
  new Types.Sprite(texCenter),
  new Types.Sprite(texCenter),
  new Types.Sprite(texRight),
]

banner.forEach((part, i) => {
  part.height = 32
  part.width = 32

  part.anchor.set(16, 16) // Anchor on the center
  part.pos.set(50 + (32 * i), 40)

  game.scene.add(part)
})

longerBanner.forEach((part, i) => {
  part.height = 32
  part.width = 32

  part.anchor.set(16, 16)
  part.pos.set(30 + (32 * i), 25)

  game.scene.add(part)
})

game.run((dt: number, t: number) => {
  banner.forEach(part => {
    part.pos.x += Math.cos(t) * .3
    part.pos.y += Math.sin(t) * .3
  })

  longerBanner.forEach(part => {
    part.pos.x += Math.sin(t) * .3
    part.pos.y += Math.cos(t) * .3
  })
})

