export default class Movement {
    constructor() {
        this.delay = 150;
        this.repeat = 50;
        this.delayTime = 0;
        this.repeatTime = 0;
        this.dir = 0;
        this.started = false;
    }

    start(dir) {
        this.delayTime = 0;
        this.repeatTime = this.repeat;
        this.dir = dir;
        this.started = true;
    }

    cancel() {
        this.started = false;
    }

    update(entity, deltaTime) {

        let time = deltaTime * 1000;
        
        if (this.started) {
            if (this.delayTime < this.delay) {
                this.delayTime += time;
            }

            if (this.delayTime >= this.delay) {

                if (this.repeatTime >= this.repeat) {
                    while (this.repeatTime >= this.repeat && this.repeat > 0) {
                        entity.move(this.dir);
                        this.repeatTime -= this.repeat;
                    }
                }
                this.repeatTime += time;
            }
        }
    }
}
