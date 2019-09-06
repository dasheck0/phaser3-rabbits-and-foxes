/**
 * Created by appcom interactive GmbH on 06.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import TextCell from './textCell';

export default class IconTextCell extends TextCell {
  constructor(text, iconKey, textOptions) {
    super(text, textOptions);
    this.iconKey = iconKey;
  }

  onBind(scene, cellWidth, cellHeight) {
    if (this.textOptions.wordWrap) {
      this.textOptions.wordWrap.width = cellWidth;
    }

    return scene.ui.add.label({
      width: cellWidth,
      height: cellHeight,
      text: scene.add.text(0, 0, this.text, this.textOptions),
      icon: scene.add.sprite(0, 0, this.iconKey),
      iconMask: true,
      space: {
        left: this.textOptions.padding || 0,
        right: this.textOptions.padding || 0,
        top: this.textOptions.padding || 0,
        bottom: this.textOptions.padding || 0,
        icon: this.textOptions.padding || 0,
      }
    });
  }
}
