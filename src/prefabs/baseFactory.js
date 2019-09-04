import 'phaser';
import { random } from 'lodash';

export default class {
  constructor(name, scene, options, profile, globals) {
    this.name = name;
    this.scene = scene;
    this.options = options;
    this.profile = profile;
    this.globals = globals;
    this.time = scene.time;

    this.pool = this.scene.groups[options.pool];
    this.interval = options.interval || 1000;
    this.mode = options.mode || 'infinite';
    this.limit = options.limit || -1;

    this.schedule();
  }

  schedule() {
    this.timer = this.time.addEvent(this.getConfiguration());
  }

  spawn() {
  }

  /* private */

  isAllowed() {
    return this.mode === 'once' ||
      this.mode === 'infinite' ||
      (this.mode === 'limited' && (this.pool.countActive(true) < this.limit || this.limit === -1));
  }

  getConfiguration() {
    return {
      delay: this.interval,
      repeat: this.mode === 'once' ? 0 : -1,
      loop: this.mode !== 'once',
      callback: () => {
        if (this.isAllowed()) {
          const position = {
            x: random(0, this.globals.grid.rowCount),
            y: random(0, this.globals.grid.columnCount)
          };
          let object = this.pool.getFirstDead();

          if (object) {
            object.reset(position.x, position.y);
          } else {
            const name = `object_${this.pool.countActive()}`;
            object = this.spawn(name, position);
          }
        }
      },
      callbackScope: this
    };
  }
}
