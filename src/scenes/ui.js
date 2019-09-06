import BaseScene from './base';

export default class UIScene extends BaseScene {
  constructor() {
    super('ui');
  }

  create() {
    super.create();
    console.log("hjkdf", this.prefabs)

    console.log("Created scene ui");

    const w = this.input.keyboard.addKey('W');  // Get key object
    w.on('down', function (event) {
      this.prefabs.rabbitPanel.show();
    }, this);


    const s = this.input.keyboard.addKey('S');  // Get key object
    s.on('down', function (event) {
      this.prefabs.rabbitPanel.hide();
    }, this);
  }
}
