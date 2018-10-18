import Vec from "./Vec";

export default class Wall {
    constructor(pos, basePos) {
        this.pos = pos;
        this.basePos = basePos;
    }
    get type() {
        return 'wall';
    }
    static create(pos) {
        let basePos = pos.plus(new Vec(0.2, 0.1));
        return new Wall(pos, basePos);
    }
}

Wall.prototype.size = new Vec(0.6, 0.6);

Wall.prototype.update = function(dom) {
    let pos = new Vec(
        this.pos.x - dom.scrollLeft,
        this.pos.y - dom.scrollRight
    );
    return new Wall(
        pos,
        pos.plus(new Vec(0.2, 0.1)),
    );
};
