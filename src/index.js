import 'phaser';

import config from './assets/config';
import { TestScene } from "./scenes/test";

const game = new Phaser.Game({
    width: config.width,
    height: config.height,
    scene: [TestScene]
});

game.scene.start('test', { configFile: 'assets/states/test.yml' });