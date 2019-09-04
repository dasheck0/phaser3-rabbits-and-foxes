import BaseScene from './base';

export class MainScene extends BaseScene {
  constructor() {
    super('main');
  }

  create() {
    super.create();

    this.cameras.main.setBounds(0, 0, 50 * 48, 50 * 48);

    const cursors = this.input.keyboard.createCursorKeys();

    this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl({
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
      zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
      acceleration: 0.006,
      drag: 0.0005,
      maxSpeed: 0.5
    });
  }

  update(delta) {
    this.controls.update(delta);
  }
}
