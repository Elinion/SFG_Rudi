/* globals __DEV__ */
import Phaser from 'phaser'
import Rudi from '../components/Rudi'
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
    this.isRudiAwake = false
    this.rudiAwakingTime = 3000;
  }

  preload() {
    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.game.load.spritesheet(`player${i}`, `../../assets/images/player${i}.png`, 40, 30)
    }
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    for (let i = 0; i < this.nbOfPlayers; i++) {
      this.players[i] = new Player({
        game: this,
        x: (i + 1) * 100,
        y: (i + 1) * 100,
        asset: `player${i}`,
        input: this.playersInputs[i],
        color: this.playersColors[i],
        pos: i * 15,
      })
      this.players[i].onInit()

      this.game.add.existing(this.players[i])
    }

    this.players[game.rnd.integerInRange(0, this.players.length - 1)].hasCarnet = true

    this._createRudi()
  }

  _createRudi() {
    this.rudi = new Rudi(this.game, this.players)
    setTimeout(() => {
      this.isRudiAwake = true;
    }, this.rudiAwakingTime)
  }

  update () {
    this.players.map(player => {
      player.checkCarnet()
      player.movePlayer()
      player.updateScore()
    })

    this.game.physics.arcade.overlap(this.players, this.players, this._onPlayersCollide)
    this._updateRudi()
  }

  _updateRudi () {
    if(this.isRudiAwake) {
      const playerToChase = this._getPlayerWithCarnet()
      this.rudi.chasePlayer(playerToChase)
      this.rudi.checkPlayerCollision()
    }
  }

  _getPlayerWithCarnet () {
    return this.players.find(player => player.hasCarnet)
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
}
