import 'phaser';
import { times } from 'lodash';

import Storable from './storable';

export default class extends Storable {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);

    this.time = scene.time;
    this.pool = scene.groups[options.pool];
    this.interval = options.interval || 1000;
    this.mode = options.mode || 'infinite';
    this.limit = options.limit || -1;
    this.amount = options.amount || 1;

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
      this.mode === 'singleShot' ||
      this.mode === 'infinite' ||
      (this.mode === 'limited' && (this.pool.countActive(true) < this.limit || this.limit === -1));
  }

  getConfiguration() {
    return {
      delay: this.interval || 0,
      repeat: (this.mode === 'once' || this.mode === 'singleShot') ? 0 : -1,
      loop: (this.mode !== 'once' && this.mode !== 'singleShot'),
      callback: () => {
        times(this.amount, () => {
          if (this.isAllowed()) {
            const name = `object_${this.pool.countActive()}`;
            this.spawn(name);
          }
        });
      },
      callbackScope: this
    };
  }
}
