import plants from "./levels";
import Level from "./Level";
import DOMDisplay from "./DOMDisplay";
import State from "./State";
import Handle from "./Handle";
const width = wx.getSystemInfoSync().windowWidth;
const height = wx.getSystemInfoSync().windowHeight;
const canvas = wx.createCanvas();
canvas.width = width;
canvas.height = height;
let ctx = canvas.getContext("2d");

export default class Main {
    constructor() {
        this.aniId = 0;
        this.event = {
            x: 0,
            y: 0,
            type: "none"
        };
        this.registerEventListener();
        this.levels = plants.map(level => {
            return new Level(level);
        });
        this.levelIndex = 0;
        this.restart();
    }

    restart() {
        this.frame = 0;

        const handle = new Handle(canvas.width, canvas.height);
        this.state = State.start(this.levels[this.levelIndex], handle);
        this.domDisplay = new DOMDisplay(ctx, this.levels[this.levelIndex]);

        this.bindLoop = this.loop.bind(this);
        this.hasEventBind = false;

        cancelAnimationFrame(this.aniId);

        this.aniId = requestAnimationFrame(this.bindLoop, canvas);
    }

    registerEventListener() {
        wx.onTouchStart(e => {
            this.event.type = "touchstart";
            this.event.x = e.touches[0].clientX;
            this.event.y = e.touches[0].clientY;
            console.log('touchstart')
        });
        wx.onTouchEnd(e => {
            this.event.type = "touchend";
            this.event.x = e.changedTouches[0].clientX;
            this.event.y = e.changedTouches[0].clientY;
        });
        wx.onTouchMove(e => {
            this.event.type = "touchmove";
            this.event.x = e.touches[0].clientX;
            this.event.y = e.touches[0].clientY;
        });
    }

    render() {
        // restart game
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.domDisplay.setState(this.state);
    }

    update() {
        this.state = this.state.update(this.event);
        if (this.state.status === "lost") {
            this.restart();
        } else if (this.state.status === "won") {
            this.levelIndex += 1;
            this.restart();
        }
    }

    loop() {
        this.frame++;

        this.update();
        this.render();

        this.aniId = requestAnimationFrame(this.bindLoop, canvas);
    }
}
