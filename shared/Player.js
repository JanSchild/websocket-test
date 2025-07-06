export class Player {
    constructor(id, x, y, width, height, speed, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.color = color;
    }

    static fromJSON(data) {
        return new this(data.id, data.x, data.y, data.width, data.height, data.speed, data.color);
    }

    dataForFullSync() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            speed: this.speed,
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

    move(dir) {
        if (dir === 'left') this.x -= this.speed;
        if (dir === 'right') this.x += this.speed;
        if (dir === 'up') this.y -= this.speed;
        if (dir === 'down') this.y += this.speed;
    }

    calculatePositionAfterMovement(dir) {
        let x = this.x;
        let y = this.y;
        if (dir === 'left') x -= this.speed;
        if (dir === 'right') x += this.speed;
        if (dir === 'up') y -= this.speed;
        if (dir === 'down') y += this.speed;
        return { x, y };
    }

    rectsOverlap(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}
