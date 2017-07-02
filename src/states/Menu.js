import Phaser from 'phaser'

export default class Menu extends Phaser.State {

  constructor () {
    super()
  }

  create () {
    this._createTitle()
    this._createButtons()
  }

  _createButtons () {
    let {game} = this
    this.group = game.add.group()
    const onPlay = () => this._startGame()
    this.playButton = game.make.button(game.world.centerX - 95, 300, 'playButton', onPlay, this, 2, 1, 0)
    this.group.add(this.playButton)
  }

  _createTitle () {
    const style = {font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'}
    this.text = this.game.add.text(0, 0, 'R.U.D.I', style)
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
    this.text.setTextBounds(0, 100, 800, 100)
  }

  _startGame() {
    this.game.state.start('Game');
  }
}