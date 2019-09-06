/**
 * Created by appcom interactive GmbH on 06.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { merge } from 'lodash';

export default class TextCell {
  constructor(text, textOptions) {
    this.text = text;
    this.textOptions = textOptions || TextCell.defaultStyle();
  }

  onBind(scene, cellWidth, cellHeight) {
    if (this.textOptions.wordWrap) {
      this.textOptions.wordWrap.width = cellWidth;
    }

    return scene.ui.add.label({
      width: cellWidth,
      height: cellHeight,
      text: scene.add.text(0, 0, this.text, this.textOptions),
      space: {
        left: this.textOptions.padding || 0,
        right: this.textOptions.padding || 0,
        top: this.textOptions.padding || 0,
        bottom: this.textOptions.padding || 0
      }
    });
  }

  static defaultStyle(options = {}) {
    return merge({
      fontSize: '12px',
      fontFamily: 'Arial',
      color: '#000000',
      align: 'center',
      lineSpacing: 44,
      wordWrap: {
        width: 450,
        useAdvancedWrap: true
      }
    }, options);
  }
}
