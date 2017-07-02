export default class Rudi {
  constructor (game) {
    this.speed = 150
    this.gameObject = game.add.sprite(100, 100, 'rudi')
    this.gameObject.anchor.setTo(0.5, 0.5)

    this.chasePlayer = this.chasePlayer.bind(this)
  }

  chasePlayer (player) {
    console.log(this.gameObject)
    let {velocity: target} = player
    let {velocity: rudi} = this.gameObject.body
    // rudi.x = target.x - rudi.x
    // rudi.y = target.y - rudi.y
    rudi.x = 100
  };
}