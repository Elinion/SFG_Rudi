export default class Rudi {

  constructor (game, players) {
    this.players = players
    this.game = game
    this.speed = 150
    this.gameObject = game.add.sprite(100, 100, 'rudi')
    this.gameObject.anchor.setTo(0.5, 0.5)
    this.gameObject.position.x = 400
    game.physics.enable(this.gameObject)

    this.chasePlayer = this.chasePlayer.bind(this)
    this.checkPlayerCollision = this.checkPlayerCollision.bind(this)
  }

  chasePlayer (player) {
    this.game.physics.arcade.moveToObject(
      this.gameObject,
      player,
      this.speed,
    )
  };

  checkPlayerCollision() {
    this.game.physics.arcade.overlap(
      this.gameObject,
      this.players,
      (rudi, player) => this._onPlayerCollision(player),
    )
  }

  _onPlayerCollision (player) {
    if (player.hasCarnet) {
      console.log('restart scene')
      //this.game.state.start('Game')
    }
  }
}