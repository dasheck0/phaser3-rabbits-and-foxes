/**
 * Created by appcom interactive GmbH on 04.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import BaseFactory from './baseFactory';
import Rabbit from './rabbit';

export default class extends BaseFactory {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);
  }

  spawn(name, position) {
    super.spawn();

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
}
