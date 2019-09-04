import 'phaser';

export default class {
    constructor(name, scene, options) {
        this.name = name;
        this.scene = scene;
        this.time = scene.time;

        this.pool = options.pool;
        this.interval = options.interval || 1000;
        this.mode = options.mode || 'infinite';
        this.limit = options.limit || -1;

        this.schedule();
    }

    schedule() {
        this.timer = this.time.addEvent(this.getConfiguration());
    }

    spawn() {
        console.log("go")
    }

    /* private */

    isAllowed() {
        return this.mode === 'once' ||
            this.mode === 'infinite' ||
            (this.mode === 'limited' && (this.pool.countActive(true) < this.limit || this.limit === -1));
    }

    getConfiguration() {
        return {
            delay: this.interval,
            repeat: this.mode === 'once' ? 0 : -1,
            loop: this.mode !== 'once',
            callback: () => {
                if (this.isAllowed()) {
                    this.spawn();
                }
            },
            callbackScope: this
        };
    }
}