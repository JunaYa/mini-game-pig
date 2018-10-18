import Vec from "./Vec";
import State from "./State";

export default class Coin {
    constructor(pos, basePos, wobble) {
        this.pos = pos;
        this.basePos = basePos;
        this.wobble = wobble;
    }
    get type() {
        return "coin";
    }
    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Coin(pos, basePos, Math.random() * Math.PI * 2);
    }
}

Coin.prototype.size = new Vec(0.6, 0.6);

Coin.prototype.collide = function(state) {
    let filtered = state.actors.filter(a => a != this);
    let status = state.status;
    if (!filtered.some(a => a.type == "coin")) status = "won";
    return new State(state.level, filtered, status, state.handle);
};

const wobbleSpeed = 5;
const wobbleDist = 0.02;
Coin.prototype.update = function() {
    const time = 0.03;
    let wobble = this.wobble + time * wobbleSpeed;
    let wobblePos = Math.sin(wobble) * wobbleDist;
    return new Coin(
        this.pos.plus(new Vec(0, wobblePos)),
        this.basePos,
        wobble
    );
};

