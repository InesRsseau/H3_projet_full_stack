var config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  backgroundColor: "#0072bc",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

var cursors;
var player;
var monster;
var bullet;

var game = new Phaser.Game(config);

function preload() {
  this.load.image("bullet", "assets/bullet.png");
}

function create() {
  player = this.add.rectangle(400, 300, 64, 64, 0xffffff);

  this.physics.add.existing(player, false);

  cursors = this.input.keyboard.createCursorKeys();

  player.body.setCollideWorldBounds(true);

  bullet = this.physics.add.group();

  //add a monster red rectangle with collision
  monster = this.add.rectangle(200, 200, 64, 64, 0xff0000);
  this.physics.add.existing(monster, true);

  //add a collider between the player and the monster
  this.physics.add.collider(player, monster);

  //add a collider between the bullet and the monster
  this.physics.add.collider(bullet, monster, function (bullet, monster) {
    bullet.destroy();
    monster.destroy();
  });
}

function update() {
  player.body.setVelocity(0);

  if (cursors.left.isDown) {
    player.body.setVelocityX(-300);
  } else if (cursors.right.isDown) {
    player.body.setVelocityX(300);
  }

  if (cursors.up.isDown) {
    player.body.setVelocityY(-300);
  } else if (cursors.down.isDown) {
    player.body.setVelocityY(300);
  }

  // if the z key is pressed, fire a bullet
  if (this.input.keyboard.checkDown(this.input.keyboard.addKey("Z"), 500)) {
    var bullet = this.physics.add.sprite(player.x, player.y, 0.1, "bullet");
    bullet.body.setVelocity(player.body.velocity.x / 2, -300);
    this.physics.add.collider(bullet, monster, function (bullet, monster) {
      bullet.destroy();
      monster.destroy();
    });
  } else if (
    this.input.keyboard.checkDown(this.input.keyboard.addKey("S"), 500)
  ) {
    var bullet = this.physics.add.sprite(player.x, player.y, 0.1, "bullet");
    bullet.body.setVelocity(player.body.velocity.x / 2, 300);
    this.physics.add.collider(bullet, monster, function (bullet, monster) {
      bullet.destroy();
      monster.destroy();
    });
  } else if (
    this.input.keyboard.checkDown(this.input.keyboard.addKey("Q"), 500)
  ) {
    var bullet = this.physics.add.sprite(player.x, player.y, 0.1, "bullet");
    bullet.body.setVelocity(-300, player.body.velocity.y / 2);
    this.physics.add.collider(bullet, monster, function (bullet, monster) {
      bullet.destroy();
      monster.destroy();
    });
  } else if (
    this.input.keyboard.checkDown(this.input.keyboard.addKey("D"), 500)
  ) {
    var bullet = this.physics.add.sprite(player.x, player.y, 0.1, "bullet");
    bullet.body.setVelocity(300, player.body.velocity.y / 2);
    this.physics.add.collider(bullet, monster, function (bullet, monster) {
      bullet.destroy();
      monster.destroy();
    });
  }
}
