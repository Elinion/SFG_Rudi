import Phaser from 'phaser'
import { updateImagesRandom, animDuration } from '../utils'

export default class Menu extends Phaser.State {
  init () {
    this.animDuration = animDuration
    this.animationEasing = Phaser.Easing.Circular.InOut

    this._startGame = this._startGame.bind(this)

    this.decorationsData = [
      { key: 'deco1', percentx: 0.1, percenty: 0.44, scale: 0.5, random: true },
      { key: 'deco2', percentx: 0.8, percenty: 0.15, scale: 1, random: false },
      { key: 'deco3', percentx: 0.1, percenty: 0.2, scale: 1, random: true },
      { key: 'deco4', percentx: 0.8, percenty: 0.7, scale: 0.4, random: true },
      { key: 'deco5', percentx: 0.25, percenty: 0, scale: 0.5, random: false }
    ]
  }

  create () {
    this._createBg()
    this._createTitle()
    this._createButtons()
    this._createDeco()

    this.timer = this.game.time.create(false)
    this.timer.loop(this.animDuration, updateImagesRandom, this, this.game, [
      { image: this.title, frames: 6 },
      { image: this.playButton, frames: 4 },
      { image: this.decorationsItems[0], frames: 6 },
      { image: this.decorationsItems[2], frames: 6 },
      { image: this.decorationsItems[3], frames: 6 }
    ])
    this.timer.start()
  }

  update () {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this._startGame()
    }
  }

  _createBg () {
    this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg')
  }

  _createButtons () {
    this.buttonGroup = this.game.add.group()
    this._createPlayButton()
    this.buttonGroup.add(this.playButton)
    this.buttonGroup.position.set(this.game.world.centerX, this.game.world.centerY * 1.35)
    this.buttonGroup.pivot.setTo(0.5)
  }

  _createPlayButton () {
    const onPlay = () => this._startGame()
    this.playButton = this.game.make.button(0, 0, 'playBtn', onPlay, this)
    this.playButton.animations.add('wiggle')

    const scale = (this.game.world.width / 3) / this.playButton.width
    this.playButton.scale.setTo(scale)

    this.playButton.anchor.setTo(0.5)
  }

  _createTitle () {
    const posX = this.game.world.centerX
    const posY = this.game.world.height * 0.25

    this.title = this.game.add.sprite(posX, posY, 'title')
    this.title.anchor.setTo(0.5)

    const scale = (this.game.world.width / 4) / this.title.width
    this.title.scale.setTo(scale)

    this.title.animations.add('wiggle')
  }

  _createDeco () {
    this.decorationsItems = this.decorationsData.map((element, index) => {
      const sprite = this.game.add.sprite(this.game.world.width * element.percentx, this.game.world.height * element.percenty, element.key)
      sprite.scale.setTo(element.scale)
      const anim = sprite.animations.add('wiggle')

      if (!element.random) {
        anim.play(1 / (this.animDuration / 1000), true)
      }

      return sprite
    })
  }

  _startGame () {
    this.game.state.start('Game')
  }
}
