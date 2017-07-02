/* globals __DEV__ */
import Phaser from 'phaser'
import Rudi from '../components/Rudi'

export default class extends Phaser.State {

  constructor () {
    super()
    this._movePlayer = this._movePlayer.bind(this)
    this._endTimer = this._endTimer.bind(this)
    this._updateRudi = this._updateRudi.bind(this)
  }

  init() {
    this.players = []
    this.angle = 200
    this.lockedTimer = 3000
    this.nbOfPlayers = 2
    this.playersInputs = ['LEFT', 'RIGHT']
  }

  preload () {
    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.game.load.spritesheet(`player${i}`, `../../assets/images/player${i}.png`, 40, 30)
    }
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.players[i] = this.game.add.sprite((i + 1) * 100, (i + 1) * 100, `player${i}`)
      this.players[i].anchor.setTo(0.5, 0.5)
      this.game.physics.enable(this.players[i], Phaser.Physics.ARCADE)

      // Initial speed.
      this.players[i].body.velocity.x = 0
      this.players[i].body.velocity.y = 0

      // Bounce against walls.
      this.players[i].body.collideWorldBounds = true
      this.players[i].body.bounce.set(1)

      // Manage collisions timer
      this.players[i].timer = this.game.time.create()
      this.players[i].timer.add(this.lockedTimer, this._endTimer, this, this.players[i])

      this.players[i].input = this.playersInputs[i]
      this.players[i].didInput = false
      this.players[i].hasCarnet = false
    }

    this.players[0].hasCarnet = true

    this.rudi = new Rudi(this.game, this.players)
  }

  update () {
    this.players.map(player => {
      this._checkCarnet(player)
      this._movePlayer(player)

      this.game.physics.arcade.overlap(this.players, this.players, this._onPlayersCollide)
    })

    this._updateRudi()
  }

  _updateRudi () {
    const playerToChase = this._getPlayerWithCarnet()
    this.rudi.chasePlayer(playerToChase)
    this.rudi.checkPlayerCollision()
  }

  _getPlayerWithCarnet () {
    return this.players.find(player => player.hasCarnet)
  }

  _movePlayer (player) {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard[player.input])) {
      player.body.angularVelocity = -this.angle
      player.didInput = true
    } else {
      if (player.didInput) {
        player.body.angularVelocity = 0
        this.game.physics.arcade.velocityFromAngle(player.angle, 200, player.body.velocity)
        player.didInput = false
      }

      if (player.body.blocked.up || player.body.blocked.down) {
        let collisionAngle = player.body.rotation - 90
        player.body.rotation = 270 - collisionAngle
      } else if (player.body.blocked.right || player.body.blocked.left) {
        player.body.rotation = 180 - player.body.rotation
      }
    }
  }

  _checkCarnet (player) {
    if (player.hasCarnet) {
      player.frame = 1
    } else if (player.frame === 1) {
      player.frame = 0
    }
  }

  _onPlayersCollide (player1, player2) {
    if (player1.hasCarnet && !player2.timer.running) {
      player1.timer.start()
      player1.hasCarnet = false
      player2.hasCarnet = true
    } else if (player2.hasCarnet && !player1.timer.running) {
      player2.timer.start()
      player2.hasCarnet = false
      player1.hasCarnet = true
    }
  }

  _endTimer (player) {
    player.timer.destroy()

    // Manage collisions timer
    player.timer = this.game.time.create()
    player.timer.add(this.lockedTimer, this._endTimer, this, player)
  }
}
