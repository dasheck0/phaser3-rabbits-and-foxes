import BaseScene from './base';

export class MainScene extends BaseScene {
  constructor() {
    super('main');
  }

  create() {
    super.create();

    this.timeTrigger = 1000;
    this.lastTime = 0;

    this.cameras.main.setBounds(
      0,
      0,
      this.globals.grid.rowCount * this.globals.grid.size,
      this.globals.grid.columnCount * this.globals.grid.size
    );

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

    const w = this.input.keyboard.addKey('W');  // Get key object
    w.on('down', function (event) {
      this.scene.pause();
    }, this);


    const s = this.input.keyboard.addKey('S');  // Get key object
    s.on('down', function (event) {
      this.scene.resume();
    }, this);
  }

  update(time, delta) {
    super.update(time, delta);

    this.controls.update(time);

    if (this.lastTime === 0) {
      this.lastTime = time;
    }

    if (time - this.lastTime > this.timeTrigger * this.globals.speed) {
      this.groups.rabbits.getChildren().forEach(child => child.update(time, delta));
      this.lastTime = time;
      // this.prefabs.ground.update(time, delta);
    }
  }
}
