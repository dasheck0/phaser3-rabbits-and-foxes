import 'phaser';

import config from './assets/config';
import { MainScene } from "./scenes/main";

const game = new Phaser.Game({
  width: config.width,
  height: config.height,
  backgroundColor: config.backgroundColor || '#000',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  'render.transparent': true,
  scene: [MainScene]
});

game.scene.start('main', { configFile: 'assets/states/main.yml' });
