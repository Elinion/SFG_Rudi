import Phaser from 'phaser'

export default class Rudi extends Phaser.Sprite {

  constructor (game, x, y, asset, players) {
    super(game, x, y, asset)
    this.players = players
    this.game = game
    this.speed = 150
    this.anchor.setTo(0.5, 0.5)
    this.game.physics.enable(this);
    this.body.setSize(10, 10)

    this.chasePlayer = this.chasePlayer.bind(this)
    this.checkPlayerCollision = this.checkPlayerCollision.bind(this)
  }

  chasePlayer (player) {
    this.game.physics.arcade.moveToObject(
      this,
      player,
      this.speed,
    )
  };

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