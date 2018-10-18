const margin = 5;
const azimuthMargin = 28;
function within(point, action) {
    const left = action.x - action.width - margin;
    const right = action.x + action.width + margin;
    const top = action.y - action.height - margin;
    const bottom = action.y + action.height + margin;
    if (
        point.x > left &&
        point.x < right &&
        point.y > top &&
        point.y < bottom
    ) {
        action.active= !action.active;
        return action;
    }
    return false;
}

export default class Handle {
    constructor(viewWidth, viewHeight) {
        const centerPoint = {
            x: viewWidth / 4,
            y: (viewHeight * 3) / 5
        };
        this.size = {
            width: 20,
            height: 20
        };
        this.lineWidth = margin;
        this.azimuths = [
            {
                action: "CENTER",
                x: centerPoint.x,
                y: centerPoint.y,
                width: this.size.width,
                height: this.size.height,
                active: false,
            },
            {
                action: "LEFT",
                x: centerPoint.x - this.size.width - azimuthMargin,
                y: centerPoint.y,
                width: this.size.width,
                height: this.size.height,
                active: false,
            },
            {
                action: "TOP",
                x: centerPoint.x,
                y: centerPoint.y - this.size.height - azimuthMargin,
                width: this.size.width,
                height: this.size.height,
                active: false,
            },
            {
                action: "RIGHT",
                x: centerPoint.x + this.size.width + azimuthMargin,
                y: centerPoint.y,
                width: this.size.width,
                height: this.size.height,
                active: false,
            },
            {
                action: "BOTTOM",
                x: centerPoint.x,
                y: centerPoint.y + this.size.height + azimuthMargin,
                width: this.size.width,
                height: this.size.height,
                active: false,
            }
        ];
        this.attacks = [
            {
                action: "JUMP",
                x: (viewWidth * 5) / 6,
                y: (viewHeight * 3) / 4,
                width: 24,
                height: 24,
                active: false,
            }
        ];
    }

    get Azimuths() {
        return this.azimuths;
    }

    get Attacks() {
        return this.attacks;
    }
}

Handle.prototype.actions = function(point) {
    const azimuthValue = this.azimuths.map(azimuth => {
        if (point.type !== "touchmove") {
            return false;
        }
        return within(point, azimuth);
    }).filter(azimuth => {return azimuth;})[0];

    const attackValue = this.attacks.map(attack => {
        if (point.type !== "touchstart") {
            return false;
        }
        return within(point, attack);
    })[0];
    return {
        azimuth: azimuthValue,
        attack: attackValue
    };
};

