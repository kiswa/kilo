import { Controls, Game, Scene, Types } from 'kilo/lib'

export class GameOverScene extends Scene {
  private gameOver: Types.Text
  private restart: Types.Text

  constructor(game: Game, controls: Controls, onComplete: Function) {
    super(game, onComplete, controls)

    this.gameOver = this.add(new Types.Text('GAME OVER', {
      font: '20px monospace',
      fill: '#fff',
      align: 'center'
    }))

    this.restart = this.add(new Types.Text('Press ESC to restart', {
      font: '16px monospace',
      fill: '#fff',
      align: 'center'
    }))

    this.gameOver.pos.set(game.width / 2, game.height / 2 - 15)
    this.gameOver.visible = false

    this.restart.pos.set(game.width / 2, game.height / 2)
    this.restart.visible = false
  }

  update(dt: number, t: number) {
    super.update(dt, t)

    if (!this.gameOver.visible && t >= .5) {
      this.gameOver.visible = true
      this.restart.visible = true
    }

    this.gameOver.alpha = Math.sin(t * 3) * .5 + .5

    if (this.controls.keys.key('Escape')) {
      this.onSceneComplete()
    }
  }

}
