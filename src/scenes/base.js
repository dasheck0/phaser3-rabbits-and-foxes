import YAML from 'yamljs';
import * as prefabs from '../prefabs/index';

export default class BaseScene extends Phaser.Scene {
    constructor(key = 'default') {
        super({ key });
    }

    init(options) {
        if (!options.configFile) {
            throw new Error('There is no configFile for the scene');
        }

        this.config = YAML.load(options.configFile);
        if (!this.config) {
            throw new Error('There is no config for the scene');
        }
    }

    preload() {
        Object.keys(this.config.assets).forEach((key) => {
            const value = this.config.assets[key];

            if (value.type === 'image') {
                this.load.image(key, value.src);
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
            this.prefabs[key] = new (prefabs[value.type])(key, this, value.options);
        });
    }
}