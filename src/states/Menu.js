import Phaser from 'phaser'

export default class Menu extends Phaser.State {
  init () {
    this.animMaxDuration = 500
    this.animMinDuration = 100
    this.animationEasing = Phaser.Easing.Circular.InOut
  }

  create () {
    this._createTitle()
    this._createButtons()
  }

  update () {
    this._updateTitle()
  }

  _createButtons () {
    this.buttonGroup = this.game.add.group()
    this._createPlayButton()
    this.buttonGroup.add(this.playButton)
    this.buttonGroup.position.set(this.game.world.centerX, this.game.world.centerY)
  }

  _createPlayButton () {
    const onPlay = () => this._startGame()
    this.playButton = this.game.make.button(0, 0, 'playButton', onPlay, this)
    this.playButton.anchor.setTo(0.5)
  }

  _createTitle () {
    const style = {font: 'Love Ya Like A Sister', fontSize: 150, fill: '#000', boundsAlignH: 'right', boundsAlignV: 'middle'}

    const posX = this.game.world.centerX
    const posY = this.game.world.height * 0.35

    this.titleGroup = this.game.add.group()

    let startPosition = 0

    String('Rudi !').split('').map((letter, i) => {
      const letterText = this.game.add.text(startPosition, 0, letter, style)

      letterText.isAnimOver = true

      startPosition += letterText.width / 2
      letterText.anchor.setTo(0.5, 0.5)
      letterText.position.setTo(startPosition, 0)

      this.titleGroup.add(letterText)
      startPosition += letterText.width / 2
    });

    this.titleGroup.pivot.x = (this.titleGroup.width / 2)
    this.titleGroup.position.setTo(posX, posY)
  }

  _updateTitle () {
    this.titleGroup.children.map(letterText => {
      if (letterText.isAnimOver) {
        const animDuration = this.game.rnd.integerInRange(this.animMinDuration, this.animMaxDuration)
        const scaleGoal = this.game.rnd.realInRange(-0.1, 0.1)

        const angleTween = this.game.add.tween(letterText).to({
          angle: this.game.rnd.integerInRange(-5, 5)
        }, animDuration, this.animationEasing, true)

        angleTween.onStart.add(() => { letterText.isAnimOver = false })
        angleTween.onComplete.add(() => { letterText.isAnimOver = true })

        this.game.add.tween(letterText.scale).to({
          x: 1 + scaleGoal,
          y: 1 + scaleGoal
        }, animDuration, this.animationEasing, true)
      }
    })
  }

  _startGame () {
    this.game.state.start('Game')
  }
}
