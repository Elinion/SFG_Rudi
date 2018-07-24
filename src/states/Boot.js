import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#fff'
    this.fontsReady = true
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    /* WebFont.load({
      google: {
        families: ['Bangers', 'Knewave', 'Rock Salt', 'Love+Ya+Like+A+Sister']
      },
      active: this.fontsLoaded
    }) */

    let text = this.add.text(this.world.centerX, this.world.centerY, 'loading fonts', { font: '16px Arial', fill: '#dddddd', align: 'center' })
    text.anchor.setTo(0.5, 0.5)

    this.load.spritesheet('title', './assets/images/titleSpritesheet.png', 555, 265, 6)
    this.load.spritesheet('playBtn', './assets/images/playSpritesheet.png', 1359, 896, 4)
    this.load.spritesheet('deco1', './assets/images/deco1.png', 500, 500, 6)
    this.load.spritesheet('deco2', './assets/images/deco2.png', 309, 291, 16)
    this.load.spritesheet('deco3', './assets/images/deco3.png', 102, 95, 6)
    this.load.spritesheet('deco4', './assets/images/deco4.png', 500, 500, 6)
    this.load.spritesheet('deco5', './assets/images/deco5.png', 500, 500, 20)

    this.load.image('bg', './assets/images/paperBg.jpg')
    this.load.image('loaderBg', './assets/images/loader-bg.png')
    this.load.image('loaderBar', './assets/images/loader-bar.png')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }
}
