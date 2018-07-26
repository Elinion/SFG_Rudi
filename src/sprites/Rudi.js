import Phaser from 'phaser'
import { animDuration } from '../utils'

export default class Rudi extends Phaser.Sprite {
  constructor (game, x, y, atlas, players) {
    super(game, x, y, atlas)
    this.players = players
    this.game = game
    this.speed = 0
    this.maxSpeed = 180
    this.increaseSpeedInterval = 5
    this.anchor.setTo(0.5, 0.5)
    this.scale.setTo(0.3)
    this.game.physics.enable(this);

    const hitboxRadius = 20
    this.body.setCircle(hitboxRadius, (this.width * 1/this.scale.x * this.anchor.x) - hitboxRadius, (this.height * 1/this.scale.y * this.anchor.y) - hitboxRadius)

    this.animations.add('defaultRudi', Phaser.Animation.generateFrameNames('rudi-', 0, 5))
    this.animations.play('defaultRudi', 1 / (animDuration / 1000), true)

    this.chasePlayer = this.chasePlayer.bind(this)
    this.checkPlayerCollision = this.checkPlayerCollision.bind(this)
  }

  chasePlayer (player) {
    this.game.physics.arcade.moveToObject(
      this,
      player,
      this.speed,
    )
    // Uncomment this to make the sprite rotate in the chased player's direction
    /* const angleInRadians = this.game.physics.arcade.angleBetween(this, player)
    const angleInDegrees = angleInRadians * 180 / Math.PI
    this.body.rotation = angleInDegrees */
  }

  // Increase Rudi's speed every x seconds 
  _increaseSpeed (t) {
    if (this.speed <= this.maxSpeed) {
      setTimeout(() => {
        this.speed += t
        this._increaseSpeed(5)
      }, this.increaseSpeedInterval * 1000)
    }
  }

  checkPlayerCollision () {
    this.game.physics.arcade.overlap(
      this,
      this.players,
      (rudi, player) => this._onPlayerCollision(player),
    )
  }

  _endGame () {
    this.game.state.start('GameOver')
  }

  _onPlayerCollision (player) {
    if (player.hasCarnet) {
      this._endGame()
    } else {
      player.stun()
    }
  }
}
