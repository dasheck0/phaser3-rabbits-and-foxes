/**
 * Created by appcom interactive GmbH on 05.09.2019
 * Copyright © 2019 appcom interactive GmbH. All rights reserved.
 */

import { capitalize } from 'lodash';

import Panel from './panel';
import TextCell from './panelCells/textCell';
import IconTextCell from './panelCells/iconTextCell';

export default class extends Panel {
  constructor(name, scene, options, profile, globals) {
    super(name, scene, options, profile, globals);
  }

  setRabbit(rabbit, autoShow = true) {
    const headerTextStyle = TextCell.defaultStyle({ fontSize: '14px', padding: 4 });
    const bodyTextStyle = TextCell.defaultStyle({ fontSize: '12px', padding: 4 });

    this.setItems([
      new IconTextCell(rabbit.rabbitName, 'rabbit', headerTextStyle),
      new TextCell(`Age: ${rabbit.age}`, bodyTextStyle),
      new TextCell(`Sex: ${rabbit.sex ? 'Male' : 'Female'}`, bodyTextStyle),
      new TextCell(`Hunger: ${rabbit.hunger}`, bodyTextStyle),
      new TextCell(`Thirst: ${rabbit.thirst}`, bodyTextStyle),
      new TextCell(`Priority: ${capitalize(rabbit.priority)}`, bodyTextStyle),
      new TextCell(`Radius: ${rabbit.radius}`, bodyTextStyle),
    ]);

    if (autoShow) {
      this.show();
    }
  }
}
