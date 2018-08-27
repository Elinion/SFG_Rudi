import Phaser from 'phaser'
import { animDuration } from '../utils'

export default class Player extends Phaser.Sprite {
  constructor ({ game, x, y, atlas, input, color, pos }) {
    super(game, x, y, atlas)
    this.xOffset = 0.7

    this.game = game
    this.playerInput = input
    this.textColor = color
    this.textPosition = pos

    this.defaultAngle = 200
    this.bodySize = 100

    this.hasCarnet = false
    this.collisionTimer = null
    this.collisionTimerDuration = 3000
    this.score = 0
    
    this.baseScale = 0.2
    this.scale.setTo(this.baseScale)

    this.baseSpeed = 200
    this.slowSpeed = 50
    this.speed = this.baseSpeed
    this.bounceMaxSpeed = 800
    this.bounceTimerMs = 100

    this.squeezeScale = this.scale.x * 0.6
    this.squeezeTimerMs = 200

    this.rotationTimer = null
    this.currentSpeedBoost = 0
    this.speedBoost = 800
    this.maxBoostDuration = 600

    this.stunTimer = null
    this.stunTimerDuration = 3000

    this.animations.add('defaultMove', Phaser.Animation.generateFrameNames('persoDefault-', 0, 5))
    this.animations.add('carnetMove', Phaser.Animation.generateFrameNames('persoCarnet-', 0, 5))
    this.animations.add('stunMove', Phaser.Animation.generateFrameNames('persoStun-', 0, 3))
    this.animations.add('disabledMove', Phaser.Animation.generateFrameNames('persoDisabled-', 0, 3))
    this.animations.play('defaultMove', 1 / (animDuration / 1000), true)

    this.bouncePlayer = this.bouncePlayer.bind(this)
    this.checkStatus = this.checkStatus.bind(this)
    this.movePlayer = this.movePlayer.bind(this)
    this.updateScore = this.updateScore.bind(this)
  }

  onInit () {
    this.game.physics.enable(this)

    this.anchor.setTo(this.xOffset, 0.5)

    // Sprite hitbox.
    this.body.setCircle(this.bodySize, (this.width * 1/this.scale.x * this.anchor.x) - this.bodySize, (this.height * 1/this.scale.y * this.anchor.y) - this.bodySize)

    // Initial speed.
    this.body.velocity.x = 0
    this.body.velocity.y = 0

    // Bounce against everything!
    this.body.collideWorldBounds = true
    this.body.bounce.setTo(1, 1)

    // Manage collisions timer
    this._createTimer('collisionTimer', this.collisionTimerDuration)
    this._createTimer('stunTimer', this.stunTimerDuration)
    this._createTimer('rotationTimer', this.rotationTimer)

    this.scoreText = this.game.add.text(10, this.textPosition, `Score: ${this.score}`,
      { fontSize: '15px', fill: this.textColor })
  }

  checkStatus () {
    // ==> THE PLAYER HAS HIT RUDI
    if (this.frameName.indexOf('persoDisabled-') === -1 && this.stunTimer.running) {
      // If the stun timer is running and another animation is playing, change to Stun animation.
      this.animations.play('disabledMove', 1 / (animDuration / 1000), true)
      // Disable collisions when stun.
      this.body.checkCollision.none = true
    } 

    // THE PLAYER HAS NOT HIT RUDI
    else if (!this.stunTimer.running) {
      // Enable collisions back when not stun.
      this.body.checkCollision.none = false

      // THE PLAYER HAS BEEN STOLEN THE CARNET
      if (this.frameName.indexOf('persoStun-') === -1 && this.collisionTimer.running) {
        // If the player is disabled and is playing another animation, change to disabled animation.
        this.animations.play('stunMove', 1 / (animDuration / 1000), true)
      }

      // THE PLAYER HAS NOT BEEN STOLEN THE CARNET
      else if (!this.collisionTimer.running) {
        // THE PLAYER CURRENTLY HAS THE CARNET
        if (this.frameName.indexOf('persoCarnet-') === -1 && this.hasCarnet) {
          // If the player gets the Carnet and is playing another animation, change to Carnet animation.
          this.animations.play('carnetMove', 1 / (animDuration / 1000), true)
        } 
  
        // THE PLAYER CURRENTLY DOESN'T HAVE THE CARNET
        else if (this.frameName.indexOf('perso-0-') === -1 && !this.hasCarnet) {
          // If the player loses the Carnet and is playing another animation, change to default animation.
          this.animations.play('defaultMove', 1 / (animDuration / 1000), true)
        }
      }
    }
    
    
  }

  // When the player collides with something (wall, player, Rudi), give them a very small speed dash.
  // Also make their sprite squeeze!
  bouncePlayer (upDown = false, leftRight = false, maxSpeed = this.bounceMaxSpeed, duration = this.bounceTimerMs) {
    this.speed = maxSpeed
    const collisionBounce = game.add.tween(this)
    
    collisionBounce.onStart.add(() => {
      this.isBouncing = true
    }, this)

    collisionBounce.onComplete.add(() => {
      this.isBouncing = false
      this._updateSpeed()
    }, this)
    
    collisionBounce.to({ speed: this.baseSpeed }, duration, Phaser.Easing.Linear.None, true)
    // this.squeezePlayer(upDown ? this.squeezeScale : this.baseScale, leftRight ? this.squeezeScale : this.baseScale)
  }

  // Squeeze the player's scale by a number.
  squeezePlayer(scaleX = this.baseScale, scaleY = this.baseScale) {
    const collisionSqueeze = game.add.tween(this.scale)
    collisionSqueeze.to({ x: scaleX, y: scaleY }, this.squeezeTimerMs / 4, Phaser.Easing.Exponential.Out, true)

    const collisionSqueezeBack = game.add.tween(this.scale)
    collisionSqueezeBack.to({ x: this.baseScale, y: this.baseScale }, this.squeezeTimerMs * 3/4, Phaser.Easing.Exponential.Out)
    
    collisionSqueeze.onComplete.add(() => {
      collisionSqueezeBack.start()
    })
  }

  movePlayer () {
    if (this.isBouncing) { // If the player is bouncing, update their speed to tween.
      this._updateSpeed()
    }

    if (this.stunTimer.running) { // If the player is stunned, divide their speed (takes bounce into account).
      this.speed = this.slowSpeed;
    } else if (!this.isBouncing) { // Else, if the player is not bouncing, force update their speed.
      if (this.speed === this.slowSpeed) { // If the player is not stunned but still slow, update their speed to normal speed.
        this._updateSpeed()
      }
      this.speed = this.baseSpeed;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard[this.playerInput])) {
      this._rotationPlayer()
    } 

    if (!this.game.input.keyboard.isDown(Phaser.Keyboard[this.playerInput]) || this.isBouncing) {
      if (this.isTurning) {
        this._speedBoostPlayer()
        this.isTurning = false
      }

      if (this.body.blocked.up || this.body.blocked.down) {
        let collisionAngle = this.body.rotation - 90;
        this.body.rotation = 270 - collisionAngle;
        this.bouncePlayer(false, true)
      } else if (this.body.blocked.right || this.body.blocked.left) {
        this.body.rotation = 180 - this.body.rotation;
        this.bouncePlayer(false, true)
      }
    }
  }

  _rotationPlayer () {
    this.body.angularVelocity = -this.defaultAngle;
    this.isTurning = true

    // if the timer has not started, start it (1st frame)
    // else, if the timer is still running, increment boost
    // else, when timer is over, don't increment speed boost anymore

    if (!this.rotationTimer.running) {
      // this.rotationTimer.start()
    }
    else {
      // this.currentSpeedBoost++ // TODO: adjust speed gain per frame
    }
  }

  // this is called only when the player releases their button
  _speedBoostPlayer () {
    if (this.rotationTimer.running) {
      // this._endTimer(this.rotationTimer, this.maxBoostDuration)
    }
    this._updateSpeed()
  }

  _updateSpeed () {
    this.body.angularVelocity = 0;
    this.game.physics.arcade.velocityFromAngle(this.angle, this.speed, this.body.velocity);
  }

  stun () {
    this.stunTimer.start();
    this._updateSpeed()
  }

  updateScore () {
    if (this.hasCarnet) {
      this.score ++;
      this.scoreText.text = `Score: ${this.score}`;
    }
  }

  _createTimer (timer, duration) {
    this[timer] = this.game.time.create();
    this[timer].add(duration, this._endTimer, this, timer, duration);
  }

  _endTimer (timer, duration) {
    this[timer].destroy();

    this._createTimer(timer, duration);
  }
}
