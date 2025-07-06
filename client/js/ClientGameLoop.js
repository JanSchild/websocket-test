import { ClientPlayersManager } from "./ClientPlayersManager.js";

export class ClientGameLoop {
    static isRunning = false;
    static canvas;
    static context;

    static start(canvas, context) {
        ClientGameLoop.canvas = canvas;
        ClientGameLoop.context = context;
        ClientGameLoop.isRunning = true;
        ClientGameLoop.gameLoop();
    }

    static stop() {
        ClientGameLoop.isRunning = false;
    }

    static gameLoop() {
        ClientGameLoop.update();
        ClientGameLoop.render();
        if (ClientGameLoop.isRunning) {
            requestAnimationFrame(ClientGameLoop.gameLoop);
        }
    }

    static update() {

    }

    static render() {
        ClientGameLoop.context.clearRect(0, 0, ClientGameLoop.canvas.width, ClientGameLoop.canvas.height);
        for (let [id, player] of ClientPlayersManager.players) {
            let isMyself = ClientPlayersManager.myID == id;
            player.render(ClientGameLoop.context, isMyself);
        }
    }
}