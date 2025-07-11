import { Player } from "../shared/Player.js";

export class ClientPlayer extends Player {
    render(ctx, isMyself) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        if (isMyself) {
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}