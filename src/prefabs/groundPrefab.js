/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import 'phaser';
import { times, random } from 'lodash';

const getGroundMapTiles = () => {
  const percent = random(0, 1, true);
  return percent > 0.85 ? 1 : 2;
};

const intersect = (tl1, br1, tl2, br2) => {
  const rect1 = new Phaser.Geom.Rectangle(tl1[0], tl1[1], br1[0] - tl1[0], br1[1] - tl1[1]);
  const rect2 = new Phaser.Geom.Rectangle(tl2[0], tl2[1], br2[0] - tl2[0], br2[1] - tl2[1]);

  if (rect1 && rect2) {
    return Phaser.Geom.Intersects.GetRectangleToRectangle(rect1, rect2).length > 0;
  }

  return false;
};

const placeWaterPits = (data, lakes, repeat = 0) => {
  if (repeat >= 0) {
    const centerX = random(0, data.length);
    const centerY = random(0, data[0].length);
    const radiusX = random(2, 5);
    const radiusY = random(2, 5);

    const someIntersect = lakes.some((lake) => {
      return intersect(
        [centerX - radiusX, centerY - radiusY],
        [centerX + radiusX, centerY + radiusY],
        lake.tl,
        lake.br
      );
    });

    if (someIntersect) {
      placeWaterPits(data, lakes, repeat - 1);
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

export default class {
  constructor(name, scene, options = {}) {
    this.name = name;
    this.scene = scene;

    const x = (options.size || {}).x || 5;
    const y = (options.size || {}).y || 5;

    const lakes = [];
    const data = times(x, () => times(y, () => getGroundMapTiles()));

    times(random(15, 20), () => placeWaterPits(data, lakes, 3));

    this.map = this.scene.make.tilemap({ data, tileWidth: 48, tileHeight: 48 });
    const tiles = this.map.addTilesetImage('tilemap');
    const layer = this.map.createStaticLayer(0, tiles, 0, 0);
  }
}
