export class Player {
    constructor(id, x = 0, y = 0, color = '#000000') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
    }

    static fromJSON(data) {
        return new this(data.id, data.x, data.y, data.color);
    }

    toJSON() {
        return this.dataToSend();
    }

    dataToSend() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            color: this.color
        };
    }

    move(dir, speed = 5) {
        if (dir === 'left') this.x -= speed;
        if (dir === 'right') this.x += speed;
        if (dir === 'up') this.y -= speed;
        if (dir === 'down') this.y += speed;
    }
}
