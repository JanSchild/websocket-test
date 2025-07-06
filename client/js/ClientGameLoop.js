import { ClientGameRenderer } from "./ClientGameRenderer.js";

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
        if (ClientGameLoop.isRunning) {
            ClientGameLoop.update();
            ClientGameRenderer.render();
            requestAnimationFrame(ClientGameLoop.gameLoop);
        }
    }

    static update() {

    }
}