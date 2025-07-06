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
        ClientGameLoop.update();
        ClientGameRenderer.render();
        if (ClientGameLoop.isRunning) {
            requestAnimationFrame(ClientGameLoop.gameLoop);
        }
    }

    static update() {

    }
}