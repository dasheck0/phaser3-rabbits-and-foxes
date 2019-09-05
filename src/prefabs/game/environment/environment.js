/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import 'phaser';
import { times, random } from 'lodash';

import Storable from '../../base/storable';

export default class Ground extends Storable {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);

    const x = (options.size || {}).x || 5;
    const y = (options.size || {}).y || 5;

    const lakes = [];
    this.data = times(x, () => times(y, () => Ground.getGroundMapTiles()));

    times(random(profile.water.count.min, profile.water.count.max), () => this.placeWaterPits(this.data, lakes, 3));

    this.map = this.scene.make.tilemap({
      data: this.data,
      tileWidth: globals.grid.size,
      tileHeight: globals.grid.size
    });
    const tiles = this.map.addTilesetImage('tilemap');
    const layer = this.map.createDynamicLayer(0, tiles, 0, 0);
  }

  getCell(x, y) {
    if (x < 0 || y < 0 || x >= this.options.size.x || y >= this.options.size.y) {
      return null;
    }

    const isLand = [1, 2].indexOf(this.data[y][x]) >= 0;
    const isWater = !isLand;
    const hasGrass = this.data[y][x] === 1;

    return {
      x,
      y,
      isLand,
      isWater,
      hasGrass
    };
  }

  removeGrass(x, y) {
    if (x >= 0 && y >= 0 && x < this.options.size.x && y < this.options.size.y) {
      this.data[y][x] = 2;
      this.map.putTileAt(2, x, y);
    }
  }

  addGrass(x, y) {
    if (x >= 0 && y >= 0 && x < this.options.size.x && y < this.options.size.y) {
      this.data[y][x] = 1;
      this.map.putTileAt(1, x, y);
    }
  }

  update() {
    this.data.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 2) {
          if (random(0, 1, true) < this.profile.grass.growRate) {
            this.data[y][x] = 1;
            this.map.putTileAt(1, x, y);
          }
        }
      });
    });

    this.redraw();
  }

  /* private */

  static getGroundMapTiles() {
    const percent = random(0, 1, true);
    return percent > 0.85 ? 1 : 2;
  };

  static intersect(tl1, br1, tl2, br2) {
    const rect1 = new Phaser.Geom.Rectangle(tl1[0], tl1[1], br1[0] - tl1[0], br1[1] - tl1[1]);
    const rect2 = new Phaser.Geom.Rectangle(tl2[0], tl2[1], br2[0] - tl2[0], br2[1] - tl2[1]);

    if (rect1 && rect2) {
      return Phaser.Geom.Intersects.GetRectangleToRectangle(rect1, rect2).length > 0;
    }

    return false;
  };

  placeWaterPits(data, lakes, repeat = 0) {
    if (repeat >= 0) {
      const centerX = random(0, data.length);
      const centerY = random(0, data[0].length);
      const radiusX = random(this.profile.water.radius.min, this.profile.water.radius.max);
      const radiusY = random(this.profile.water.radius.min, this.profile.water.radius.max);

      const someIntersect = lakes.some((lake) => {
        return Ground.intersect(
          [centerX - radiusX, centerY - radiusY],
          [centerX + radiusX, centerY + radiusY],
          lake.tl,
          lake.br
        );
      });

      if (someIntersect) {
        this.placeWaterPits(data, lakes, repeat - 1);
      } else {
        lakes.push({
          tl: [centerX - radiusX, centerY - radiusY],
          br: [centerX + radiusX, centerY + radiusY]
        });

        for (let y = centerY - radiusY; y < centerY + radiusY; y += 1) {
          if (y >= 0 && y < data.length) {
            for (let x = centerX - radiusX; x < centerX + radiusX; x += 1) {
              if (x >= 0 && x < data[y].length) {
                if (x === centerX - radiusX && y === centerY - radiusY) {
                  data[y][x] = 8;
                } else if (x === centerX - radiusX && y === centerY + radiusY - 1) {
                  data[y][x] = 13;
                } else if (x === centerX + radiusX - 1 && y === centerY - radiusY) {
                  data[y][x] = 9;
                } else if (x === centerX + radiusX - 1 && y === centerY + radiusY - 1) {
                  data[y][x] = 14;
                } else if (x === centerX - radiusX) {
                  data[y][x] = 3;
                } else if (x === centerX + radiusX - 1) {
                  data[y][x] = 7;
                } else if (y === centerY - radiusY) {
                  data[y][x] = 4;
                } else if (y === centerY + radiusY - 1) {
                  data[y][x] = 6;
                } else {
                  data[y][x] = 0;
                }
              }
            }
          }
        }
      }
    }
  };
}
