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
    this.bodySize = 50
    this.updateSpeed = false

    this.hasCarnet = false
    this.collisionTimer = null
    this.collisionTimerDuration = 3000
    this.score = 0
    this.speed = 200

    this.stunTimer = null
    this.stunTimerDuration = 3000

    this.animations.add('defaultMove', Phaser.Animation.generateFrameNames('persoDefault-', 0, 5))
    this.animations.add('carnetMove', Phaser.Animation.generateFrameNames('persoCarnet-', 0, 5))
    this.animations.add('stunMove', Phaser.Animation.generateFrameNames('persoStun-', 0, 3))
    this.animations.add('disabledMove', Phaser.Animation.generateFrameNames('persoDisabled-', 0, 3))
    this.animations.play('defaultMove', 1 / (animDuration / 1000), true)
    this.scale.setTo(0.5)

    this.checkCarnet = this.checkCarnet.bind(this)
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

    // Bounce against walls.
    this.body.collideWorldBounds = true
    this.body.bounce.set(1)

    // Manage collisions timer
    this._createTimer('collisionTimer', this.collisionTimerDuration)
    this._createTimer('stunTimer', this.stunTimerDuration)

    this.scoreText = this.game.add.text(10, this.textPosition, `Score: ${this.score}`,
      { fontSize: '15px', fill: this.textColor })
  }

  checkCarnet () {
    if (this.frameName.indexOf('persoDisabled-') === -1 && this.stunTimer.running) {
      // If the stun timer is running and another animation is playing, change to Stun animation.
      this.animations.play('disabledMove', 1 / (animDuration / 1000), true)
    } 

    else if (!this.stunTimer.running) {
      if (this.frameName.indexOf('persoStun-') === -1 && this.collisionTimer.running) {
        // If the player is disabled and is playing another animation, change to disabled animation.
        this.animations.play('stunMove', 1 / (animDuration / 1000), true)
      }

      else if (!this.collisionTimer.running) {
        if (this.frameName.indexOf('persoCarnet-') === -1 && this.hasCarnet) {
          // If the player gets the Carnet and is playing another animation, change to Carnet animation.
          this.animations.play('carnetMove', 1 / (animDuration / 1000), true)
        } 
  
        else if (this.frameName.indexOf('perso-0-') === -1 && !this.hasCarnet) {
          // If the player loses the Carnet and is playing another animation, change to default animation.
          this.animations.play('defaultMove', 1 / (animDuration / 1000), true)
        }
      }
    }
    
    
  }

  checkStun () {
    /* if (this.stunTimer.running) {
      this.loadTexture(this.stunAsset, 0, false)
    } else if (this.key === this.stunAsset) {
      // this.loadTexture(this.defaultAsset, 0, false)
    } */
  }

  movePlayer () {
    if (this.stunTimer.running) {
      this.speed = 50;
    } else {
      if (this.speed === 50) {
        this.updateSpeed = true
      }
      this.speed = 200;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard[this.playerInput])) {
      this.body.angularVelocity = -this.defaultAngle;
      this.updateSpeed = true;
    } else {
      if (this.updateSpeed) {
        this.body.angularVelocity = 0;
        this.game.physics.arcade.velocityFromAngle(this.angle, this.speed, this.body.velocity);
        this.updateSpeed = false;
      }

      if (this.body.blocked.up || this.body.blocked.down) {
        let collisionAngle = this.body.rotation - 90;
        this.body.rotation = 270 - collisionAngle;
      } else if (this.body.blocked.right || this.body.blocked.left) {
        this.body.rotation = 180 - this.body.rotation;
      }
    }
  }

  stun () {
    this.stunTimer.start();
    this.updateSpeed = true;
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
