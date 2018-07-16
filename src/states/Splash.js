import Phaser from 'phaser'
import { centerGameObjects } from '../utils'

export default class extends Phaser.State {
  init () {}

  preload () {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg')
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    this.load.setPreloadSprite(this.loaderBar)
    //
    // load your assets
    //
    this.game.load.image('tryAgain', '../../assets/images/tryAgain.png')
    this.game.load.image('rudi', '../../assets/images/rudi.png');
    this.game.load.image('playButton', '../../assets/images/playButton.png');
  }

  create () {
    this.state.start('Menu')
  }
}
