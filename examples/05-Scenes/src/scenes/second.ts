import { Game, Scene, Types } from 'kilo/lib'

export class SecondScene extends Scene {
  private text: Types.Text
  private isComplete: boolean
  private timeInScene: number

  constructor(game: Game, onComplete: Function) {
    super(game, onComplete)

    const t = new Types.Text('Second Scene', {
      fill: '#fff',
      font: '16pt monospace',
      align: 'center'
    })
    t.pos.set(game.width / 2, game.height / 2 - 8)

    this.text = this.add<Types.Text>(t)
    this.isComplete = false
    this.timeInScene = 0
  }

  update(dt: number, t: number) {
    super.update(dt, t)

    if (this.isComplete) {
      return
    }

    this.text.pos.x += Math.sin(t) * .3
    this.text.pos.y += Math.cos(t) * .3

    if ((this.timeInScene += dt) > 5) {
      this.isComplete = true
      this.onSceneComplete()
    }
  }
}

