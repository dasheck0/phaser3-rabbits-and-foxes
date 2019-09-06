import YAML from 'yamljs';
import * as prefabs from '../prefabs/index';

export default class BaseScene extends Phaser.Scene {
  constructor(key = 'default') {
    super({ key });
  }

  init(options) {
    this.globals = options.globals;
    this.profileFile = options.profileFile;

    if (!options.configFile) {
      throw new Error('There is no configFile for the scene');
    }

    this.profile = YAML.load(options.profileFile);
    this.config = YAML.load(options.configFile);

    if (!this.config || !this.profile) {
      throw new Error('There is no config or profile for the scene');
    }
  }

  preload() {
    Object.keys(this.config.assets).forEach((key) => {
      const value = this.config.assets[key];

      if (value.type === 'image') {
        this.load.image(key, value.src);
      }

      if (value.type === 'scenePlugin') {
        this.load.scenePlugin({
          key: key,
          url: value.url,
          sceneKey: value.sceneKey
        });
      }
    });
  }

  create() {
    this.groups = {};

    Object.keys(this.config.groups).forEach((key, index) => {
      const name = this.config.groups[key];

      const group = this.add.group();
      group._zIndex = index;

      this.groups[name] = group;
    });

    this.prefabs = {};

    Object.keys(this.config.prefabs).forEach((key) => {
      const value = this.config.prefabs[key];
      this.prefabs[key] = new (prefabs[value.type])(key, this, value.options, this.profile, this.globals);
    });

    this.scenes = {};

    Object.keys(this.config.scenes || []).forEach((key) => {
      const name = this.config.scenes[key];
      const scene = this.scene.get(key);
      this.scene.launch(name, {
        configFile: `assets/states/${name}.yml`,
        profileFile: this.profileFile,
        globals: this.globals
      });

      this.scenes[name] = scene;
    });
  }

  getScene(name) {
    if (this.scenes[name]) {
      return this.scenes[name];
    }

    const scene = this.scene.get(name);
    this.scenes[name] = scene;

    return scene;
  }
}
