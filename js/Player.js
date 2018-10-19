import Vec from "./Vec";

export default class Player {
    constructor(pos, speed) {
        this.pos = pos;
        this.speed = speed;
    }
    get type() {
        return "player";
    }
    static create(pos) {
        return new Player(pos.plus(new Vec(0, -0.5)), new Vec(0, 0));
    }
}

Player.prototype.size = new Vec(0.8, 1.5);

const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;
Player.prototype.update = function(state, actions) {
    const time = 0.03;
    let xSpeed = 0;
    const isLeftAction =
        actions && actions.azimuth && actions.azimuth.action === "LEFT";
    const isRight =
        actions && actions.azimuth && actions.azimuth.action === "RIGHT";
    if (isLeftAction) xSpeed -= playerXSpeed;
    if (isRight) xSpeed += playerXSpeed;
    
    let pos = this.pos;
    let movedX = pos.plus(new Vec(xSpeed * time, 0));
    if (!state.level.touches(movedX, this.size, "wall")) {
        pos = movedX;
    }
    let ySpeed = this.speed.y + time * gravity;
    let movedY = pos.plus(new Vec(0, ySpeed * time));
    const isJumpAction = actions.attack && actions.attack.action === "JUMP";
    if (!state.level.touches(movedY, this.size, "wall")) {
        pos = movedY;
    } else if (isJumpAction && ySpeed > 0) {
        ySpeed = -jumpSpeed;
    } else {
        ySpeed = 0;
    }

    return new Player(pos, new Vec(xSpeed, ySpeed));
};
