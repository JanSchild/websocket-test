import { ClientPlayersManager } from "./ClientPlayersManager.js";

export class ClientGameRenderer {
    static canvas;
    static context;

    static initialize(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    static render() {
        this.clearContext();
        this.renderPlayers();
    }

    static clearContext() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    static renderPlayers() {
        for (let [id, player] of ClientPlayersManager.players) {
            let isMyself = ClientPlayersManager.myID == id;
            player.render(this.context, isMyself);
        }
    }
}