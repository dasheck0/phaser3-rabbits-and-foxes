/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { random } from 'lodash';

import BaseFactory from '../../base/baseFactory';

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

  spawn() {
    super.spawn();
    let repeat = this.repeat;

    let position;
    let spawnIncorrect = true;

    do {
      repeat -= 1;

      position = this.spawnPosition();
      const cell = this.scene.prefabs.ground.getCell(position.x, position.y);
      if (cell && cell.isLand && !cell.hasGrass) {
        spawnIncorrect = false;
        break;
      }
    } while (repeat >= 0);

    if (!spawnIncorrect) {
      this.scene.prefabs.ground.addGrass(position.x, position.y);
    }
  }
}
