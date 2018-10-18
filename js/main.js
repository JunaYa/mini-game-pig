import plants from "./levels";
import Level from "./Level";
import DOMDisplay from "./DOMDisplay";
import State from "./State";
import Handle from "./Handle";

const canvas = wx.createCanvas();
let ctx = canvas.getContext("2d");

export default class Main {
    constructor() {
        this.aniId = 0;

        this.levels = plants.map(level => {
            return new Level(level);
        });

        this.restart();
    }

    restart() {
        this.frame = 0;
        canvas.removeEventListener("touchstart", this.touchHandler);

        this.event = {
            x: 0,
            y: 0,
            type: "none"
        };

        const handle = new Handle(canvas.width, canvas.height);
        this.state = State.start(this.levels[1], handle);
        this.domDisplay = new DOMDisplay(ctx, this.levels[1]);

        this.bindLoop = this.loop.bind(this);
        this.hasEventBind = false;

        cancelAnimationFrame(this.aniId);

        this.aniId = requestAnimationFrame(this.bindLoop, canvas);
    }

    touchEventHandler(e) {
        e.preventDefault();

        let x = 0;
        let y = 0;

        this.event.type = e.type;
        if (e.type === "touchend") {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
            this.event.x = x;
            this.event.y = y;
        } else {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
            this.event.x = x;
            this.event.y = y;
        }
    }

    render() {
        // restart game
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.domDisplay.setState(this.state);
        if (!this.hasEventBind) {
            this.hasEventBind = true;
            this.touchHandler = this.touchEventHandler.bind(this);
            canvas.addEventListener("touchstart", this.touchHandler);
            canvas.addEventListener("touchend", this.touchHandler);
            canvas.addEventListener("touchmove", this.touchHandler);
        }
    }

    update() {
        this.state = this.state.update(this.frame, this.event);
    }

    loop() {
        this.frame++;

        this.update();
        this.render();

        this.aniId = requestAnimationFrame(this.bindLoop, canvas);
    }
}
