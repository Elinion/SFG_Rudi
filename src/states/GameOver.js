import Phaser from 'phaser'

export default class GameOver extends Phaser.State {

  constructor () {
    super()
  }

  preload() {
    this.game.load.image('tryAgain', '../../assets/images/tryAgain.png')
  }

  create() {
    const style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.text = this.game.add.text(0, 0, "Game Over", style);
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.text.setTextBounds(0, 100, 800, 100);

    this._createButtons()
  }

  _createButtons() {
    let {game} = this
    this.group = game.add.group();
    const onMenuClicked = () => this._goToMenu()
    this.menuButton = game.make.button(game.world.centerX - 95, 200, 'tryAgain', onMenuClicked, this, 2, 1, 0);
    this.group.add(this.menuButton);
  }

  _goToMenu() {
    console.log('menu')
  }
}