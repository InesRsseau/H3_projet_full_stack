import Phaser from "phaser";
import Dungeon from "dungeon-generator";
import Player from "./player.js";
import { db } from "./FireBaseConf.js";
import { getDatabase, ref, child, get, set } from "firebase/database";
import regeneratorRuntime from "regenerator-runtime";
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
    this.layer = null;
    this.enemySpawnPoints = [];
    this.spawnedRooms = [];

    this.bullet = null;

    // let grid = [
    //   [1, 1, 1, 0, 0],
    //   [1, 0, 1, 0, 0],
    //   [1, 1, 1, 1, 1],
    //   [0, 0, 0, 0, 1],
    //   [0, 0, 0, 1, 1],
    // ];

    // writeUserData("test", grid);
    // function writeUserData(roomsId, layout) {
    //   const db = getDatabase();
    //   set(ref(db, "rooms_spawn/" + roomsId), {
    //     layout: layout,
    //   });
    // }
  }
  async preload() {
    this.load.image("tiles", "../assets/tilesets/tiles.png");
    this.load.image("boubou", "../assets/tilesets/boubou.png");
    this.load.image("seo", "../assets/tilesets/seo.png");
    this.load.image("namiko", "../assets/tilesets/namiko.png");
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
    const dbRef = ref(getDatabase());
    get(child(dbRef, `rooms_spawn/`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          this.spawn = snapshot.val();
          // console.log(this.spawn);

          // console.log(this.spawn.test.layout);
          for (let row = 0; row < this.spawn.test.layout.length; row++) {
            for (let col = 0; col < this.spawn.test.layout[row].length; col++) {
              if (this.spawn.test.layout[row][col] === 1) {
                this.enemySpawnPoints.push({
                  x: row * 50,
                  y: col * 50,
                });
                // console.log(this.enemySpawnPoints);
              }
            }
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
    this.layer = map.createBlankLayer("Layer 1", tileset);

    for (let y = 0; y < this.dungeon.size[1]; y++) {
      for (let x = 0; x < this.dungeon.size[0]; x++) {
        if (this.dungeon.walls.get([x, y])) {
          //   console.log(`Position (${x}, ${y}) is a wall.`);
          this.layer.putTileAt(-1, x, y);
          //set collision on wall tiles
          this.layer.setCollision([-1]);
        } else {
          let randomNum = Math.random();
          let tileId;
          if (randomNum < 0.95) {
            tileId = 6;
          } else {
            tileId = [7, 8, 9][Math.floor(Math.random() * 3)];
          }
          this.layer.putTileAt(tileId, x, y);
        }
      }
    }

    this.player = new Player(
      this,
      this.dungeon.start_pos[0] * 48 + 24,
      this.dungeon.start_pos[1] * 48 + 24
    );

    this.bullet = this.physics.add.group();

    this.physics.add.collider(this.bullet, this.layer, (bullet) => {
      bullet.destroy();
    });

    this.physics.add.collider(this.player.sprite, this.layer);

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
        // console.log(
        //   "Le joueur est dans la pièce : " + piece.tag,
        //   "x : " + piece.position[0] * 50,
        //   "y : " + piece.position[1] * 50
        // );
        // console.log(piece);
        if (piece.tag !== "initial" && !this.spawnedRooms.includes(piece)) {
          this.spawnEnemies(roomRect, piece.position[0], piece.position[1]);
          console.log("Le joueur est dans une pièce non initiale");
          for (let exit of piece.exits) {
            this.layer.putTileAt(-1, exit[0][0], exit[0][1]);
            this.layer.setCollision([-1]);
          }
          this.spawnedRooms.push(piece);
        }
      }
    }
  }
  async spawnEnemies(roomRect, pieceX, pieceY) {
    console.log(this.enemySpawnPoints);
    console.log(roomRect);

    let spawnLayout =
      Math.round(Math.random() * this.enemySpawnPoints.length) - 1;

    console.log("spawn enemy !!!!!");
    let enemy = this.add.image(
      this.enemySpawnPoints[spawnLayout].x + pieceX * 50,
      this.enemySpawnPoints[spawnLayout].y + pieceY * 50,
      //pick random enemy
      ["seo", "namiko"][Math.floor(Math.random() * 2)]
    );
    enemy.setScale(0.3);
    this.enemies.add(enemy);
  }
}
