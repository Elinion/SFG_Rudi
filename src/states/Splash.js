import Phaser from 'phaser'
import { centerGameObjects, maxNumberOfPlayers } from '../utils'

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
    this.game.load.image('tryAgain', './assets/images/tryAgain.png')
    this.game.load.image('playButton', './assets/images/playButton.png')

    this.load.spritesheet('title', './assets/images/titleSpritesheet.png', 555, 265, 6)
    this.load.spritesheet('playBtn', './assets/images/playSpritesheet.png', 1359, 896, 4)
    this.load.spritesheet('deco1', './assets/images/deco1.png', 500, 500, 6)
    this.load.spritesheet('deco2', './assets/images/deco2.png', 309, 291, 16)
    this.load.spritesheet('deco3', './assets/images/deco3.png', 102, 95, 6)
    this.load.spritesheet('deco4', './assets/images/deco4.png', 500, 500, 6)
    this.load.spritesheet('deco5', './assets/images/deco5.png', 500, 500, 20)

    this.game.load.atlas(`rudi_atlas`, `./assets/sprites/rudi-atlas/spritesheet.png`, `./assets/sprites/rudi-atlas/sprites.json`)
    
    for (let i = 0; i < maxNumberOfPlayers; i++) {
      this.game.load.atlas(`player${i}_atlas`, `./assets/sprites/player${i}-atlas/spritesheet.png`, `./assets/sprites/player${i}-atlas/sprites.json`)
    }
  }

  create () {
    this.state.start('Menu')
  }
}
