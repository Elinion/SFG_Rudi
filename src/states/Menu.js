import Phaser from 'phaser'

export default class Menu extends Phaser.State {
  create () {
    this._createTitle()
    this._createButtons()
  }

  _createButtons () {
    this.group = this.game.add.group()
    this._createPlayButton()
    this.group.add(this.playButton)
    this.group.position.set(this.game.world.centerX, this.game.world.centerY)
  }

  _createPlayButton () {
    const onPlay = () => this._startGame()
    this.playButton = this.game.make.button(0, 0, 'playButton', onPlay, this)
    this.playButton.anchor.setTo(0.5)
  }

  _createTitle () {
    const style = {font: 'bold 32px Arial', fill: '#fff', boundsAlignH: 'center', boundsAlignV: 'middle'}
    const posX = this.game.world.centerX
    const posY = this.game.world.height * 0.3
    this.text = this.game.add.text(posX, posY, 'R.U.D.I', style)
    this.text.anchor.setTo(0.5)
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2)
  }

  _startGame () {
    this.game.state.start('Game')
  }
}
