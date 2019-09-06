/**
 * Created by appcom interactive GmbH on 05.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import Storable from '../base/storable';

export default class extends Storable {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);

    this.width = this.options.width || 200;
    this.height = this.options.height || 400;
    this.margin = {
      x: (this.options.margin || {}).x || 32,
      y: (this.options.margin || {}).y || 32
    };
    this.anchor = {
      x: (this.options.anchor || {}).x || 'start',
      y: (this.options.anchor || {}).y || 'start',
    };

    const anchors = [
      { name: 'start', value: -1 },
      { name: 'center', value: 0 },
      { name: 'end', value: 1 }
    ];

    if (anchors.map(anchor => anchor.name).indexOf(this.anchor.x) < 0) {
      this.anchor.x = 'start';
    }

    if (anchors.map(anchor => anchor.name).indexOf(this.anchor.y) < 0) {
      this.anchor.y = 'start';
    }


    const xAnchor = anchors.find(anchor => anchor.name === this.anchor.x).value;
    this.startX = this.globals.window.width / 2 + xAnchor * this.globals.window.width / 2 - xAnchor * this.margin.x - (this.width / 2 * xAnchor);

    const yAnchor = anchors.find(anchor => anchor.name === this.anchor.y).value;
    this.startY = this.globals.window.height / 2 + yAnchor * this.globals.window.height / 2 - yAnchor * this.margin.y - (this.height / 2 * yAnchor);

    this.create();
    this.isShown = true;
    this.hide(true);
  }

  create() {
    this.gridTable = this.scene.ui.add.gridTable({
      x: this.anchor.x === 'end' ? this.globals.window.width + this.width / 2 + this.margin.x : -this.width / 2 - this.margin.x,
      y: this.startY,
      items: [{
        id: 0,
        color: 0xff0000
      }, {
        id: 1,
        color: 0xffff00
      }],
      background: this.scene.ui.add.roundRectangle(0, 0, 20, 10, 10, 0xeeeeee),
      table: {
        width: this.width,
        height: this.height,
        cellWidth: 240,
        cellHeight: 60,
        columns: 1,
        interactive: false,
        mask: {
          padding: 2,
        },
      },
      slider: {
        track: this.scene.ui.add.roundRectangle(0, 0, 20, 10, 5, 0xd8d8d8),
        thumb: this.scene.ui.add.roundRectangle(0, 0, 0, 0, 10, 0xc8c8c8),
      },
      scroller: true,
      createCellContainerCallback: function (cell) {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          item = cell.item,
          index = cell.index;
        return scene.ui.add.label({
          width: width,
          height: height,

          background: scene.ui.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, 0xd8d8d8),
          icon: scene.ui.add.roundRectangle(0, 0, 20, 20, 10, item.color),
          text: scene.add.text(0, 0, item.id),

          space: {
            icon: 10,
            left: 15
          }
        });
      },
    })
      .layout();
  }

  show(imediately = false) {
    if (!this.isShown) {
      this.isShown = true;

      this.scene.tweens.add({
        targets: this.gridTable,
        props: {
          x: {
            value: this.startX,
            duration: imediately ? 0 : 700,
            ease: 'Sine.easeOut',
            repeat: 0
          }
        }
      });
    }
  }

  hide(imediately = false) {
    if (this.isShown) {
      this.isShown = false;

      this.scene.tweens.add({
        targets: this.gridTable,
        props: {
          x: {
            value: this.anchor.x === 'end' ? this.globals.window.width + this.width / 2 + this.margin.x : -this.width / 2 - this.margin.x,
            duration: imediately ? 0 : 700,
            ease: 'Sine.easeIn',
            repeat: 0
          }
        }
      });
    }
  }

  toggleShowHide() {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  setItems(items) {
    this.gridTable.items = items;
    this.gridTable.refresh();
  }
}
