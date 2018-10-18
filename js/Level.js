import Vec from './Vec';
import Player from './Player';
import Coin from './Coin';
import Lava from './Lava';
import Wall from './Wall';
import Empty from './Empty';

const levelChars = {
    '.' : 'empty',
    '#' : 'wall',
    '+' : Lava,
    '@' : Player,
    'o' : Coin,
    '=' : Lava,
    '|' : Lava,
    'v' : Lava,
};

export default class Level {
    constructor(plan) {
        let rows = plan.trim().split(/\n/).map(l => [...l]);
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];
        this.rows = rows.map((row, y) => {
            return row.map((ch, x) => {
                let type = levelChars[ch];
                if( typeof type == 'string' ) {
                    switch(type) {
                        case 'wall':
                            return Wall.create(new Vec(x,y));
                        case "empty":
                            return Empty.create(new Vec(x,y));
                        default :
                            return Empty.create(new Vec(x,y));
                    }
                }
                let actor = type.create(new Vec(x,y), ch);
                this.startActors.push(actor);
                return Empty.create(new Vec(x,y));
            });
        })
    }
}

Level.prototype.touches = function(pos, size, type) {
    let xStart = Math.floor(pos.x);
    let xEnd = Math.ceil(pos.x + size.x);
    let yStart = Math.floor(pos.y);
    let yEnd = Math.ceil(pos.y + size.y);

    for( let y = yStart; y < yEnd ; y++) {
        for(let x = xStart ; x < xEnd; x ++) {
            let isOutside = x < 0 || x >= this.width ||
                            y < 0 || y >= this.height;
            let here = isOutside ? "wall" : this.rows[y][x];
            if(here.type == type) return true;
        }
    }
    return false;
}