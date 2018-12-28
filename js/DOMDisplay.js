const scale = 20;
const width = wx.getSystemInfoSync().windowWidth;
const height = wx.getSystemInfoSync().windowHeight;
const baseWidth = 15;
const baseHeight = baseWidth;
let status = "";

function drawPixel(ctx, x, y, pixel, dom) {
    const startX = x * pixel.width - dom.scrollLeft;
    const startY = y * pixel.height - dom.scrollTop;
    ctx.fillStyle = pixel.color;
    ctx.fillRect(startX, startY, pixel.width, pixel.height);
}

function drawBackground(ctx) {
    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, width, height);
}

function drawActors(ctx, actors, dom) {
    const coin = {
        width: baseWidth,
        height: baseHeight,
        color: "#00ff00"
    };
    const hero = {
        width: baseWidth,
        height: baseHeight,
        color: "#0000ff",
        lost: "#c90000",
        won: "#f5d865"
    };
    const lava = {
        width: baseWidth,
        height: baseHeight,
        color: "#ff0000"
    };
    actors.map(actor => {
        switch (actor.type) {
            case "coin":
                drawPixel(ctx, actor.pos.x, actor.pos.y, coin, dom);
                break;
            case "player":
                const startX = actor.pos.x * hero.width;
                const startY = actor.pos.y * hero.height;

                if (status === "lost") {
                    ctx.fillStyle = hero.lost;
                } else if (status === "won") {
                    ctx.fillStyle = hero.won;
                } else {
                    ctx.fillStyle = hero.color;
                }

                ctx.fillRect(
                    startX - dom.scrollLeft,
                    startY - dom.scrollTop,
                    hero.width,
                    (hero.height * 3) / 2
                );
                break;
            case "lava":
                drawPixel(ctx, actor.pos.x, actor.pos.y, lava, dom);
                break;
        }
    });
}

function drawWalls(ctx, level, dom) {
    const wall = {
        width: baseWidth,
        height: baseHeight,
        color: "#ffffff"
    };
    level.rows.map((row, y) => {
        return row.map((pixel, x) => {
            switch (pixel.type) {
                case "wall":
                    drawPixel(ctx, x, y, wall, dom);
                    break;
            }
        });
    });
}

function drawHandle(ctx, handle, btnLeft, btnRight, btnJump) {
    ctx.fillStyle = "#666666";

    handle.Azimuths.map(azimuth => {
        // ctx.beginPath();
        // ctx.arc(azimuth.x, azimuth.y, azimuth.width, 0, 2 * Math.PI);
        // ctx.fillStyle = "#bebebe60";
        // ctx.imageSmoothingEnabled = true;
        // ctx.fill();
        // ctx.lineWidth = handle.lineWidth;
        // if (azimuth.active) {
        //     ctx.strokeStyle = "#bebebe90";
        // } else {
        //     ctx.strokeStyle = "#bebebe90";
        // }
        // ctx.stroke();

        if (azimuth.active) {
            switch (azimuth.action) {
                case "LEFT":
                    btnLeft.src = azimuth.icon;
                    ctx.drawImage(
                        btnLeft,
                        azimuth.x - azimuth.width,
                        azimuth.y - 2 * azimuth.height
                    );
                    break;
                case "RIGHT":
                    btnRight.src = azimuth.icon;
                    ctx.drawImage(
                        btnRight,
                        azimuth.x - azimuth.width,
                        azimuth.y - 2 * azimuth.height
                    );
                    break;
            }
        }
    });

    handle.Attacks.map(attack => {
        // ctx.beginPath();
        // ctx.arc(attack.x, attack.y, attack.width, 0, 2 * Math.PI);
        // ctx.fillStyle = "#bebebe60";
        // ctx.fill();
        // ctx.lineWidth = handle.lineWidth;
        // if (attack.active) {
        //     ctx.strokeStyle = "#bebebe90";
        // } else {
        //     ctx.strokeStyle = "#bebebe90";
        // }

        btnJump.src = attack.icon;
        ctx.drawImage(
            btnJump,
            attack.x - attack.width,
            attack.y - attack.height
        );
    });
}

export default class DOMDisplay {
    constructor(ctx, level) {
        this.dom = {
            scrollLeft: 0,
            scrollTop: 0
        };
        this.ctx = ctx;
        this.level = level;
        this.canvasWidth = baseWidth * level.width;
        this.canvasHeight = baseHeight * level.height;

        this.btnLeft = wx.createImage();
        this.btnRight = wx.createImage();
        this.btnJump = wx.createImage();
    }
    clear() {
        this.ctx.clearRect(0, 0, width, height);
    }
    resetDom() {
        this.dom = {
            scrollLeft: 0,
            scrollTop: 0
        };
    }
}

DOMDisplay.prototype.setState = function(state) {
    this.clear();
    drawBackground(this.ctx);
    drawActors(this.ctx, state.actors, this.dom);
    drawWalls(this.ctx, this.level, this.dom);
    drawHandle(
        this.ctx,
        state.handle,
        this.btnLeft,
        this.btnRight,
        this.btnJump
    );
    this.resetDom();
    status = state.status;
    this.scrollPlayerIntoView(state);
};

DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
    let marginH = width / 6;
    let marginV = height / 8;

    // The viewport
    let left = 0;
    let right = left + width;
    let top = 0;
    let bottom = top + height;

    let player = state.player;
    let center = player.pos.plus(player.size.times(0.5)).times(scale);

    if (center.x < left + marginH) {
        this.dom.scrollLeft = center.x - marginH;
    } else if (center.x > right - marginH) {
        this.dom.scrollLeft = center.x + marginH - width;
    }
    if (center.y < top + marginV) {
        this.dom.scrollTop = center.y - marginV;
    } else if (center.y > bottom - marginV) {
        this.dom.scrollTop = center.y + marginV - height;
    }

    this.dom.scrollLeft = Math.round(this.dom.scrollLeft);
    this.dom.scrollTop = Math.round(this.dom.scrollTop);

    if (this.dom.scrollLeft > this.canvasWidth - width + 2 * marginH) {
        this.dom.scrollLeft = this.canvasWidth - width;
    }
    if (this.dom.scrollTop > this.canvasHeight - height + 2 * marginV) {
        this.dom.scrollTop = this.canvasHeight - height;
    }
};
