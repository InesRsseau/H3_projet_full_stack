import Phaser from "phaser";
import Dungeon from "dungeon-generator";
import Player from "./player.js";
export default class DungeonScene extends Phaser.Scene {
  constructor() {
    super();
    this.dungeon = new Dungeon({
      size: [100, 100],
      // seed: "abcd",
      rooms: {
        initial: {
          min_size: [10, 10],
          max_size: [10, 10],
          max_exits: 1,
          position: [0, 0],
        },
        any: {
          min_size: [10, 10],
          max_size: [10, 10],
          max_exits: 4,
        },
        boss: {
          min_size: [10, 10],
          max_size: [10, 10],
          max_exits: 1,
        },
      },
      max_corridor_length: 1,
      min_corridor_length: 1,
      corridor_density: 0,
      symmetric_rooms: true,
      interconnects: 1,
      max_interconnect_length: 10,
      room_count: 10,
    });
  }
  preload() {
    this.load.image("tiles", "../assets/tilesets/tiles.png");
    this.load.spritesheet(
      "characters",
      "../assets/spritesheets/buch-characters-64px-extruded.png",
      {
        frameWidth: 64,
        frameHeight: 64,
        margin: 1,
        spacing: 2,
      }
    );
  }

  create() {
    this.dungeon.generate(); //outputs wall map to console.log

    let map = this.make.tilemap({
      tileWidth: 48,
      tileHeight: 48,
      width: this.dungeon.size[0],
      height: this.dungeon.size[1],
    });
    const tileset = map.addTilesetImage("tiles", null, 48, 48, 1, 2); // 1px margin, 2px spacing
    const layer = map.createBlankLayer("Layer 1", tileset);

    for (let y = 0; y < this.dungeon.size[1]; y++) {
      for (let x = 0; x < this.dungeon.size[0]; x++) {
        if (this.dungeon.walls.get([x, y])) {
          //   console.log(`Position (${x}, ${y}) is a wall.`);
          layer.putTileAt(-1, x, y);
          //set collision on wall tiles
          layer.setCollision([-1]);
        } else {
          //   console.log(`Position (${x}, ${y}) is not a wall.`);
          layer.putTileAt(6, x, y);
        }
      }
    }

    this.player = new Player(
      this,
      this.dungeon.start_pos[0] * 48 + 24,
      this.dungeon.start_pos[1] * 48 + 24
    );

    this.physics.add.collider(this.player.sprite, layer);

    const camera = this.cameras.main;
    camera.startFollow(this.player.sprite);
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update(time, delta) {
    this.player.update();

    for (let piece of this.dungeon.children) {
      let roomRect = Phaser.Geom.Rectangle.FromPoints([
        [piece.position[0] * 50, piece.position[1] * 50],
        [
          (piece.position[0] + piece.size[0] - 1) * 50,
          (piece.position[1] + piece.size[1] - 1) * 50,
        ],
      ]);

      if (
        Phaser.Geom.Rectangle.Contains(
          roomRect,
          this.player.sprite.x,
          this.player.sprite.y
        )
      ) {
        // console.log(this.player.sprite.x);
        // console.log(this.player.sprite.y);
        // console.log("Room XBase: " + piece.position[0] * 50);
        // console.log("Room YBase: " + piece.position[1] * 50);
        // console.log("Room X: " + (piece.position[0] + piece.size[0]) * 50);
        // console.log("Room Y: " + (piece.position[1] + piece.size[1]) * 50);
        console.log("player is in room: " + piece.tag);
      }
    }
  }
}
