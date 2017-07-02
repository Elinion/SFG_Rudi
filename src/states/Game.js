/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {

  init () {
  }

  preload () {
    this.game.load.image('player', './assets/images/player.png')
    this.game.load.image('rudi', './assets/images/rudi.png')
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.player = this.game.add.sprite(100, 100, 'player')
    this.player.anchor.setTo(0.5, 0.5)
    // this.rudi = new Rudi(this.game);

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE)

    // Initial speed.
    this.player.body.velocity.x = 0
    this.player.body.velocity.y = 0

    // Bounce against walls.
    this.player.body.collideWorldBounds = true
    this.player.body.bounce.set(1)

    this.angle = 200
    this.didInput = false
  }

  render () {
  }

  update () {
    let {game, player, angle} = this
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
      player.body.angularVelocity = -angle
      this.didInput = true
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
      player.body.angularVelocity = angle
      this.didInput = true
    } else {
      if (this.didInput) {
        player.body.angularVelocity = 0
        game.physics.arcade.velocityFromAngle(player.angle, 200, player.body.velocity)
        this.didInput = false
      }

      if (player.body.blocked.up || player.body.blocked.down) {
        let collisionAngle = player.body.rotation - 90
        player.body.rotation = 270 - collisionAngle
      } else if (player.body.blocked.right || player.body.blocked.left) {
        player.body.rotation = 180 - player.body.rotation
      }
    }
  }
}
