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

import Button from './Button';

export default class Main {
    constructor() {
        this.event = {
            x: 0,
            y: 0,
            type: "none"
        };
        this.gameStatus = 'start';
        this.registerEventListener();
        this.levels = plants.map(level => {
            return new Level(level);
        });
        this.levelIndex = 0;
        this.domDisplay = new DOMDisplay(ctx, this.levels[this.levelIndex]);

        this.restart();
    }

    restart() {
        const handle = new Handle(canvas.width, canvas.height);
        this.state = State.start(this.levels[this.levelIndex], handle);

        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            this.update();
            this.render();
        }, 17);
    }

    registerEventListener() {
        wx.onTouchStart(e => {
            const point = {};
            point.x = e.touches[0].clientX;
            point.y = e.touches[0].clientY;
            if (this.gameStatus !== 'playing') {
                if (this.isClickListener(point)) {
                    this.gameStatus = 'playing';
                }
            } else {
                this.event.type = "touchstart";
                this.event.x = e.touches[0].clientX;
                this.event.y = e.touches[0].clientY;
            }
        });
        wx.onTouchEnd(e => {
            if (this.gameStatus === 'playing') {
                this.event.type = "touchend";
                this.event.x = e.changedTouches[0].clientX;
                this.event.y = e.changedTouches[0].clientY;
            }
        });
        wx.onTouchMove(e => {
            if (this.gameStatus === 'playing') {
                this.event.type = "touchmove";
                this.event.x = e.changedTouches[0].clientX;
                this.event.y = e.changedTouches[0].clientY;
            }
        });
    }

    isClickListener(point) {
        let spX = point.x;
        let spY = point.y;

        const startX = (width - 168) / 2;
        const startY = (height - 48) / 2;
        return !!(spX >= startX
            && spX <= startX + 168
            && spY >= startY
            && spY <= startY + 48)
    }


    render() {
        if (this.gameStatus === 'start') {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            const start = new Button(ctx);
        } else if (this.gameStatus === 'playing') {
            this.domDisplay.setState(this.state);
        } else if (this.gameStatus === 'pause') {
            this.domDisplay.setState(this.state);
            const start = new Button(ctx);
        } else if (this.gameStatus === 'end') {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            const start = new Button(ctx);
        }
    }

    update() {
        this.state = this.state.update(this.event);
        if (this.state.status === "lost") {
            this.gameStatus = 'pause';
            this.restart();
        } else if (this.state.status === "won") {
            this.levelIndex += 1;
            this.restart();
        }
    }
}
