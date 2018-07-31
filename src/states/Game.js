import Phaser from 'phaser'
import Rudi from '../sprites/Rudi'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  constructor () {
    super()
    this._updateRudi = this._updateRudi.bind(this)
  }

  init () {
    this.players = []
    this.nbOfPlayers = 2
    this.playersInputs = ['LEFT', 'RIGHT']
    this.playersColors = ['#22b6d6', '#bf22d6']
    this.scores = []
    this.rudiBaseSpeed = 45
    this.rudiAwakingTime = 10000

    this.onPause = false
  }

  preload () {
    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.game.load.atlas(`player${i}_atlas`, `../../assets/sprites/player${i}-atlas/spritesheet.png`, `../../assets/sprites/player${i}-atlas/sprites.json`)
    }
  }

  create () {
    this._createBg()

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.players[i] = new Player({
        game: this.game,
        x: (i + 1) * 200,
        y: (i + 1) * 200,
        atlas: `player${i}_atlas`,
        input: this.playersInputs[i],
        color: this.playersColors[i],
        pos: i * 15,
      })
      this.players[i].onInit()

      this.game.add.existing(this.players[i])
    }

    this.players[this.game.rnd.integerInRange(0, this.players.length - 1)].hasCarnet = true

    this._createRudi()
  }

  _createBg () {
    this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'bg')
  }

  _createRudi () {
    const posX = this.world.centerX
    const posY = this.world.centerY
    this.rudi = new Rudi(this.game, posX, posY, 'rudi_atlas', this.players)
    this.game.add.existing(this.rudi)
    this._awakeRudiAfterTime(this.rudiAwakingTime)
  }

  _awakeRudiAfterTime (seconds) {
    setTimeout(() => {
      this.rudi.speed = this.rudiBaseSpeed
      this._increaseSpeed(5)
    }, seconds * 1000)
  }

  update () {
    if (!this.onPause) {
      this.players.map(player => {
        player.checkStatus()
        player.movePlayer()
        player.updateScore()
      })

      this.game.physics.arcade.collide(this.players, this.players, this._onPlayersCollide)
      this._updateRudi()
    }
  }

  _updateRudi () {
    const playerToChase = this._getPlayerWithCarnet()
    this.rudi.chasePlayer(playerToChase)
    this.rudi.checkPlayerCollision()
  }

  _getPlayerWithCarnet () {
    return this.players.find(player => player.hasCarnet)
  }

  _onPlayersCollide (player1, player2) {
    player1.bouncePlayer()
    player2.bouncePlayer()
    
    if (player1.hasCarnet && !player2.collisionTimer.running) {
      player1.collisionTimer.start()
      player1.hasCarnet = false
      player2.hasCarnet = true
    } else if (player2.hasCarnet && !player1.collisionTimer.running) {
      player2.collisionTimer.start()
      player2.hasCarnet = false
      player1.hasCarnet = true
    }
  }

  // This is all for debug purposes.
  render () {
    this.players.map((player, i) => {
      // this.game.debug.body(player)
      // this.game.debug.bodyInfo(player, 50, 50)
      /* this.game.debug.text(
        Math.sqrt(player.body.velocity.x * player.body.velocity.x + player.body.velocity.y * player.body.velocity.y), 
        30, 30*(i+1)
      ) */
    })

    // this.game.debug.body(this.rudi, "#17647655") 
  }
}
