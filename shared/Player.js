export class Player {
    constructor(id, x, y, width, height, color = '#000000') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    static fromJSON(data) {
        return new this(data.id, data.x, data.y, data.width, data.height, data.color);
    }

    dataForFullSync() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            color: this.color
        };
    }

    dataForPositionUpdate() {
        return {
            id: this.id,
            x: this.x,
            y: this.y
        }
    }

    move(dir, speed = 5) {
        if (dir === 'left') this.x -= speed;
        if (dir === 'right') this.x += speed;
        if (dir === 'up') this.y -= speed;
        if (dir === 'down') this.y += speed;
    }
}
