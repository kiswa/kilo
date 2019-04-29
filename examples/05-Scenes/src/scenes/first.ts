import { Game, Scene, Types } from 'kilo/lib'

export class FirstScene extends Scene {
  private text: Types.Text
  private isComplete: boolean
  private timeInScene: number

  constructor(game: Game, onComplete: Function) {
    super(game, onComplete)

    const t = new Types.Text('First Scene', {
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

    if ((this.timeInScene += dt) > 2.5) {
      this.isComplete = true
      this.onSceneComplete()
    }
  }
}

