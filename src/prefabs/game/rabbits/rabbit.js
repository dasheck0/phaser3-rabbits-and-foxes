/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { random, capitalize, sortBy, shuffle } from 'lodash'
import { uniqueNamesGenerator, UniqueNamesGeneratorConfig } from 'unique-names-generator';

import BaseSprite from '../../base/baseSprite'

export default class Rabbit extends BaseSprite {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);

    this.ground = scene.prefabs['ground'];

    this.debug = globals.debug;
    this.graphics = this.scene.add.graphics();

    this.radius = profile.rabbit.sightRadius;
    this.sigthPoints = sortBy(Rabbit.getSightPoints(0, 0, this.radius), (point) => {
      return Math.abs(point.x) + Math.abs(point.y);
    });
    this.target = null;
    this.rabbitName = uniqueNamesGenerator({
      separator: '-',
      length: 3.
    })
      .split('-')
      .map(word => capitalize(word))
      .join(' ');

    this.age = 0;
    this.hunger = 0;
    this.thirst = 0.3;
    this.isDead = false;
    this.priority = 'hunger';
    this.sex = random(0, 1, true) <= 0.5; // true men, false, woman

    if (this.sex) {
      this.setTint(0xccccff);
    }
  }

  update(time) {
    this.graphics.clear();
    this.updateAge();
    this.updateHunger();
    this.updateThirst();
    this.updatePriority();

    if (!this.isDead) {
      this.planMove();

      if (this.debug) {
        if (this.hunger > 0) {
          const hungerRect = new Phaser.Geom.Rectangle(
            this.x - this.globals.grid.size * this.originX,
            this.y - this.globals.grid.size * this.originY,
            this.globals.grid.size * this.hunger,
            4
          );

          this.graphics.lineStyle(1, 0x000000, 1.0);
          this.graphics.fillStyle(0xff0000, 0.5);
          this.graphics.strokeRectShape(hungerRect);
          this.graphics.fillRectShape(hungerRect);
        }

        if (this.thirst > 0) {
          const thirstRect = new Phaser.Geom.Rectangle(
            this.x - this.globals.grid.size * this.originX,
            this.y - this.globals.grid.size * this.originY - 4,
            this.globals.grid.size * this.thirst,
            4
          );

          this.graphics.lineStyle(1, 0x000000, 1.0);
          this.graphics.fillStyle(0x0000ff, 0.5);
          this.graphics.strokeRectShape(thirstRect);
          this.graphics.fillRectShape(thirstRect);
        }

        this.graphics.lineStyle(2, 0x000000, 1.0);
        this.graphics.fillStyle(0xff0000, 0.5);

        this.sigthPoints.forEach((sightPoint) => {
          const rect = new Phaser.Geom.Rectangle(
            this.x + sightPoint.x * this.globals.grid.size - this.globals.grid.size * this.originX,
            this.y + sightPoint.y * this.globals.grid.size - this.globals.grid.size * this.originY,
            this.globals.grid.size,
            this.globals.grid.size
          );

          this.graphics.strokeRectShape(rect);

          if (this.target) {
            this.graphics.fillRect(
              this.target.x * this.globals.grid.size,
              this.target.y * this.globals.grid.size,
              rect.width,
              rect.height);
          }
        });
      }
    }
  }

  updateAge() {
    if (!this.isDead) {
      this.age += 1;
      const ageLimit = ((1 - (1 / (1 - Math.pow(this.profile.rabbit.age.coefficient, this.profile.rabbit.age.min)))) / Math.pow(this.profile.rabbit.age.coefficient, this.profile.rabbit.age.max))
        * Math.pow(this.profile.rabbit.age.coefficient, this.age) + 1 / (1 - Math.pow(this.profile.rabbit.age.coefficient, this.profile.rabbit.age.min));

      this.isDead = random(0, 1, true) <= ageLimit;
      this.tryKill();
    }
  }

  updateHunger() {
    if (!this.isDead) {
      this.hunger += this.profile.rabbit.hunger.gain;
      this.isDead = this.hunger >= 1;
      this.tryKill();
    }
  }

  updateThirst() {
    if (!this.isDead) {
      this.thirst += this.profile.rabbit.thirst.gain;
      this.isDead = this.thirst >= 1;
      this.tryKill();
    }
  }

  updatePriority() {
    if (this.thirst >= this.hunger) {
      this.priority = 'thirst';
    } else {
      this.priority = 'hunger'
    }

    console.log("kfd", this.priority);
  }

  enableDebug(enable) {
    this.debug = enable;
  }

  tryKill() {
    if (this.isDead) {
      this.scene.groups[this.options.group].kill(this);
      this.destroy();
    }
  }

  /* private */

  planMove() {
    const gridPosition = this.positionToGridPosition();

    if (this.target) {
      const cell = this.scene.prefabs.ground.getCell(this.target.x, this.target.y);
      if (cell && !cell.hasGrass) {
        this.target = null;
      }
    }

    if (!this.target) {
      let foundTarget = false;
      this.sigthPoints.forEach((sightPoint) => {
        if (!foundTarget) {
          const cell = this.scene.prefabs.ground.getCell(gridPosition.x + sightPoint.x, gridPosition.y + sightPoint.y, true);

          let condition;


          if (this.priority === 'hunger') {
            condition = cell && cell.hasGrass;
          } else if (this.priority === 'thirst') {
            condition = cell && cell.hasWateringPlace;
          }

          if (condition) {
            foundTarget = true;
            this.target = {
              x: gridPosition.x + sightPoint.x,
              y: gridPosition.y + sightPoint.y
            }
          }
        }
      });
    }

    let newPosition;
    if (this.target) {
      const nearestSightPoints = this.sigthPoints.filter(Rabbit.predicateNeighbour).map(sightPoint => ({
        x: sightPoint.x + gridPosition.x,
        y: sightPoint.y + gridPosition.y,
        distance: Rabbit.manhattanDistance({
          x: sightPoint.x + gridPosition.x,
          y: sightPoint.y + gridPosition.y
        }, this.target)
      }));
      const shortestDistance = sortBy(nearestSightPoints, ['distance'])[0].distance;
      const nearestSightPoint = shuffle(nearestSightPoints.filter(point => point.distance === shortestDistance))[0];
      newPosition = {
        x: this.x + (nearestSightPoint.x - gridPosition.x) * this.globals.grid.size,
        y: this.y + (nearestSightPoint.y - gridPosition.y) * this.globals.grid.size
      };
    } else {
      const direction = random(0, 3);
      newPosition = [{
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
    }

    const newGridPosition = this.positionToGridPosition(newPosition);

    const cell = this.ground.getCell(newGridPosition.x, newGridPosition.y, true);
    if (cell && cell.isLand) {
      this.setPosition(newPosition.x, newPosition.y);
      if (cell.hasGrass) {
        this.ground.removeGrass(newGridPosition.x, newGridPosition.y);
        this.hunger = Math.max(this.hunger - this.profile.grass.repletion, 0);
      }

      if (cell.hasWateringPlace) {
        this.thirst = Math.max(this.thirst - this.profile.water.repletion, 0);
      }
    }

    if (this.target && newGridPosition.x === this.target.x && newGridPosition.y === this.target.y) {
      this.target = null;
    }
  }

  positionToGridPosition(position = {}) {
    return {
      x: ((position.x || this.x) - (this.globals.grid.size * this.originX)) / this.globals.grid.size,
      y: ((position.y || this.y) - (this.globals.grid.size * this.originY)) / this.globals.grid.size
    }
  }

  gridPositionToPosition(position) {
    return {
      x: position.x * this.globals.grid.size + this.globals.grid.size * this.originX,
      y: position.y * this.globals.grid.size + this.globals.grid.size * this.originY,
    }
  }

  static distance(p1, p2) {
    let dx = p2.x - p1.x;
    let dy = p2.y - p1.y;

    dx *= dx;
    dy *= dy;

    return Math.sqrt(dx + dy);
  }

  static manhattanDistance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
  }

  static getSightPoints(x, y, r) {
    const result = [];
    for (let j = x - r; j <= x + r; j++) {
      for (let k = y - r; k <= y + r; k++) {
        if (Rabbit.distance({ x: j, y: k }, { x: x, y: y }) <= r) {
          result.push({ x: j, y: k });
        }
      }
    }

    return result;
  }

  static predicateNeighbour(point) {
    return Math.abs(point.x + point.y) === 1 && Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1;
  }
}
