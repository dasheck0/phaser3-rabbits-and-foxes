/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { random } from 'lodash';

import BaseFactory from '../../base/baseFactory';
import Rabbit from './rabbit';

export default class extends BaseFactory {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);
    this.repeat = 3;
  }

  spawnPosition() {
    return {
      x: random(0, this.globals.grid.rowCount),
      y: random(0, this.globals.grid.columnCount)
    };
  }

  spawn(name) {
    super.spawn();
    let repeat = this.repeat;

    let position;
    let spawnInWater = true;

    do {
      repeat -= 1;

      position = this.spawnPosition();
      const cell = this.scene.prefabs.ground.getCell(position.x, position.y);
      if (cell && cell.isLand) {
        spawnInWater = false;
        break;
      }
    } while (repeat >= 0);

    if (!spawnInWater) {
      const properties = {
        key: 'bunny',
        group: this.options.pool,
        anchor: {
          x: 0.5,
          y: 0.5
        },
        scale: {
          x: 1.5,
          y: 1.5
        },
        position: {
          x: position.x * this.globals.grid.size + this.globals.grid.size * 0.5,
          y: position.y * this.globals.grid.size + this.globals.grid.size * 0.5
        }
      };

      return new Rabbit(name, this.scene, properties, this.profile, this.globals);
    }

    return null;
  }
}
