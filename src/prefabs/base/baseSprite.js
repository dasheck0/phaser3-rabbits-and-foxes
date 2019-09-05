import 'phaser';

export default class extends Phaser.GameObjects.Sprite {
  constructor(name, scene, options, profile, globals) {
    super(scene, options.position.x, options.position.y);

    this.name = name;
    this.options = options;
    this.profile = profile;
    this.globals = globals;

    this.setTexture(options.key);

    if (options.position.relative) {
      const x = scene.scene.manager.game.config.width * options.position.x;
      const y = scene.scene.manager.game.config.height * options.position.y;

      this.setPosition(x, y);
    }

    if (options.anchor) {
      this.setOrigin(options.anchor.x, options.anchor.y);
    }

    if (options.scale) {
      this.setScale(options.scale.x || 1, options.scale.y || 1);
    }

    this.scene = scene;
    this.scene.add.existing(this);

    const group = scene.groups[options.group];

    if (group) {
      group.add(this);
      this.depth = group._zIndex || 0;
    }
  }
}
