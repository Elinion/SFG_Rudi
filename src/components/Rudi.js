export default class Rudi {
  constructor (game) {
    this.game = game
    this.speed = 150
    this.gameObject = game.add.sprite(100, 100, 'rudi')
    this.gameObject.anchor.setTo(0.5, 0.5)
    game.physics.enable(this.gameObject);

    this.chasePlayer = this.chasePlayer.bind(this)
  }

  chasePlayer (player) {
    this.game.physics.arcade.moveToObject(
      this.gameObject,
      player,
      this.speed
    )
  };
}