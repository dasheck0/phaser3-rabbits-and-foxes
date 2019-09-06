/**
 * Created by appcom interactive GmbH on 05.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import Storable from '../base/storable';

import TextCell from './panelCells/textCell';
import IconTextCell from './panelCells/iconTextCell';

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
      items: [
        // new TextCell('Hello World', TextCell.defaultStyle({ fontSize: '18px', padding: 8 })),
        // new IconTextCell('HAAASE', 'rabbit',  TextCell.defaultStyle({  fontSize: '18px', padding: 8})),
      ],
      background: this.scene.ui.add.roundRectangle(0, 0, 20, 10, 5, 0xeeeeee),
      table: {
        width: this.width,
        height: this.height,
        cellWidth: 240,
        cellHeight: 32,
        columns: 1,
        interactive: false,
        mask: {
          padding: 2,
        },
      },
      createCellContainerCallback: cell => cell.item.onBind(cell.scene, cell.width, cell.height, cell.index),
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
    this.gridTable.setItems(items);
    console.log("srtggin item", items);
  }
}
