import { IncomingMessageQueue } from "./IncomingMessageQueue.js";
import { ServerPlayersManager } from "./ServerPlayersManager.js";
import { ServerWebSockets } from "./ServerWebSockets.js";
import { ServerGameWorld } from "./ServerGameWorld.js";

export class ServerGameLoop {
    static TICK_RATE = 60; // 60 updates per second
    static TICK_INTERVAL = 1000 / ServerGameLoop.TICK_RATE;

    static start() {
        ServerGameLoop.lastTimestamp = performance.now();
        ServerGameLoop.interval = setInterval(ServerGameLoop.gameLoop, ServerGameLoop.TICK_INTERVAL);
    }

    static stop() {
        clearInterval(ServerGameLoop.interval);
    }

    static gameLoop() {
        const now = performance.now();
        const deltaTime = (now - ServerGameLoop.lastTimestamp) / 1000;
        ServerGameLoop.lastTimestamp = now;
        ServerGameLoop.processMoveQueue();
    }

    static processMoveQueue() {
        let moveCommands = IncomingMessageQueue.getMoveCommands();
        for (let moveCommand of moveCommands) {
            moveCommand.processed = true;
            let player = ServerPlayersManager.getPlayer(moveCommand.playerID);
            if (!player) continue;
            let boundsAfterMovement = player.calculateBoundsAfterMovement(moveCommand.data.dir);
            if (!ServerGameWorld.playerCollidesWithOthers(player.id, boundsAfterMovement)) {
                player.x = boundsAfterMovement.x;
                player.y = boundsAfterMovement.y;
                ServerWebSockets.broadcast({ type: 'update', data: player.dataForPositionUpdate() });
            }
        }
        IncomingMessageQueue.removeProcessedMoveCommands();
    }
}