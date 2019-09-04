/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { random } from 'lodash'
import BaseSprite from './baseSprite'

export default class extends BaseSprite {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);

    this.ground = scene.prefabs['ground'];
    this.timeTrigger = 1000;
    this.lastTime = 0;
  }

  update(time) {
    console.log("njkfd", time);

    if (this.lastTime === 0) {
      this.lastTime = time;
    }

    if (time - this.lastTime > this.timeTrigger) {
      this.planMove();
      this.lastTime = time;
    }
  }

  /* private */

  planMove() {
    const direction = random(0, 3);
    const newPosition = [{
      x: this.x - this.globals.grid.size,
      y: this.y
    }, {
      x: this.x,
      y: this.y - this.globals.grid.size
    }, {
      x: this.x + this.globals.grid.size,
      y: this.y
    }, {
      x: this.x,
      y: this.y + this.globals.grid.size
    }][direction];

    const newGridPosition = this.positionToGridPosition(newPosition);
    const cell = this.ground.getCell(newGridPosition.x, newGridPosition.y);
    if (cell && cell.isLand) {
      this.setPosition(newPosition.x, newPosition.y);
      if (cell.hasGrass) {
        this.ground.removeGrass(newGridPosition.x, newGridPosition.y);
      }
    }
  }

  positionToGridPosition(position = {}) {
    return {
      x: ((position.x || this.x) - (this.globals.grid.size * this.originX)) / this.globals.grid.size,
      y: ((position.y || this.y) - (this.globals.grid.size * this.originY)) / this.globals.grid.size
    }
  }
}
