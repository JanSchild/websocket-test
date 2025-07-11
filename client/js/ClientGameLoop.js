import { ClientGameRenderer } from "./ClientGameRenderer.js";

export class ClientGameLoop {
    static isRunning = false;

    static start() {
        ClientGameLoop.isRunning = true;
        ClientGameLoop.gameLoop();
    }

    static stop() {
        ClientGameLoop.isRunning = false;
    }

    static gameLoop() {
        if (ClientGameLoop.isRunning) {
            ClientGameLoop.update();
            ClientGameRenderer.render();
            requestAnimationFrame(ClientGameLoop.gameLoop);
        }
    }

    static update() {

    }
}