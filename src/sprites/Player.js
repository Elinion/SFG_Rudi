export default class Player extends Phaser.Sprite {
  constructor ({ game, x, y, asset, input, color, pos }) {
    super(game, x, y, asset)
    this.anchor.setTo(0.5)

    this.game = game
    this.playerInput = input
    this.textColor = color
    this.textPosition = pos

    this.speed = 200
    this.defaultAngle = 200
    this.lockedTimer = 3000
    this.score = 0
    this.didInput = false;
    this.hasCarnet = false;

    this.checkCarnet = this.checkCarnet.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.updateScore = this.updateScore.bind(this);
  }

  onInit() {
    this.game.physics.enable(this);

    // Initial speed.
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    // Bounce against walls.
    this.body.collideWorldBounds = true;
    this.body.bounce.set(1);

    // Manage collisions timer
    this.timer = this.game.time.create();
    this.timer.add(this.lockedTimer, this._endTimer, this, this);

    this.scoreText = this.game.add.text(10, this.textPosition, `Score: ${this.score}`,
      { fontSize: '15px', fill: this.textColor });
  }


  checkCarnet() {
    if (this.hasCarnet) {
      this.frame = 1;
    } else if (this.frame === 1) {
      this.frame = 0;
    }
  }

  movePlayer() {
    if (this.game.input.keyboard.isDown(Phaser.Keyboard[this.playerInput])) {
      this.body.angularVelocity = -this.defaultAngle;
      this.didInput = true;
    } else {
      if (this.didInput) {
        this.body.angularVelocity = 0;
        this.game.physics.arcade.velocityFromAngle(this.angle, 200, this.body.velocity);
        this.didInput = false;
      }

      if (this.body.blocked.up || this.body.blocked.down) {
        let collisionAngle = this.body.rotation - 90;
        this.body.rotation = 270 - collisionAngle;
      } else if (this.body.blocked.right || this.body.blocked.left) {
        this.body.rotation = 180 - this.body.rotation;
      }
    }
  }

  updateScore() {
    if (this.hasCarnet) {
      this.score ++;
      this.scoreText.text = `Score: ${this.score}`;
    }
  }

  _endTimer(player) {
    player.timer.destroy();

    // Manage collisions timer
    player.timer = this.game.time.create();
    player.timer.add(this.lockedTimer, this._endTimer, this, player);
  }
}