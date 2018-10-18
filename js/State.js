export default class State {
    constructor(level, actors, status, handle) {
        this.level = level;
        this.actors = actors;
        this.handle = handle;
        this.status = status;
    }
    static start(level, handle) {
        return new State(level, level.startActors, "playing", handle);
    }
    get player() {
        return this.actors.find(a => a.type == "player");
    }
}

function overlap(actor1, actor2) {
    return (
        actor1.pos.x + actor1.size.x > actor2.pos.x &&
        actor1.pos.x < actor2.pos.x + actor2.size.x &&
        actor1.pos.y + actor1.size.y > actor2.pos.y &&
        actor1.pos.y < actor2.pos.y + actor2.size.y
    );
}

State.prototype.update = function(time, event) {
    const actions = this.handle.actions(event);
    const actors = this.actors.map(actor => actor.update(this, actions));
    let newState = new State(this.level, actors, this.status, this.handle);
    if (newState.status != "playing") return newState;
    let player = newState.player;
    if (this.level.touches(player.pos, player.size, "lava")) {
        return new State(this.level, actors, "lost", this.handle);
    }
    for (let actor of actors) {
        if (actor != player && overlap(actor, player)) {
            newState = actor.collide(newState);
        }
    }
    return newState;
};