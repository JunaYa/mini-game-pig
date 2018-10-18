import Vec from "./Vec";

export default class Empty {
    constructor(pos, basePos) {
        this.pos = pos;
        this.basePos = basePos;
    }
    get type() {
        return 'empty';
    }
    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Empty(pos, basePos);
    }
}

Empty.prototype.size = new Vec(0.6, 0.6);

Empty.prototype.update = function(dom) {
    let pos = new Vec(
        this.pos.x - dom.scrollLeft,
        this.pos.y - dom.scrollRight
    );
    return new Empty(
        pos,
        pos.plus(new Vec(0.2, 0.1)),
    );
};
