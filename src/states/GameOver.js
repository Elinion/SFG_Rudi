import Phaser from 'phaser'

export default class GameOver extends Phaser.State {

  constructor () {
    super()
  }

  preload () {
    this.game.load.image('tryAgain', '../../assets/images/tryAgain.png')
  }

  create () {
    this._createGameOverLabel()
    this._createButtons()
  }

  _createButtons () {
    let {game} = this
    this.group = game.add.group()
    const onTryAgainClick = () => this._reloadGame()
    this.tryAgainButton = game.make.button(game.world.centerX - 95, 200, 'tryAgain', onTryAgainClick, this, 2, 1, 0)
    this.group.add(this.tryAgainButton)
  }

  _createGameOverLabel () {
    const style = {font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'}
    this.text = this.game.add.text(0, 0, 'Game Over', style)
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    this.text.setTextBounds(0, 100, 800, 100)
  }

  _reloadGame () {
    this.game.state.start('Game')
  }
}