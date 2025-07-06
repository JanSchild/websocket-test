import { IncomingMessageQueue } from "./IncomingMessageQueue.js";
import { ServerPlayersManager } from "./ServerPlayersManager.js";
import { ServerWebSockets } from "./ServerWebSockets.js";

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
        // get move updates
        let moveCommands = IncomingMessageQueue.getMoveCommands();
        for (let moveCommand of moveCommands) {
            moveCommand.processed = true;
            let player = ServerPlayersManager.getPlayer(moveCommand.playerID);
            if (!player) continue;
            let boundsAfterMovement = player.calculateBoundsAfterMovement(moveCommand.data.dir);
            if (!ServerGameLoop.playerCollidesWithOthers(player.id, boundsAfterMovement)) {
                player.x = boundsAfterMovement.x;
                player.y = boundsAfterMovement.y;
                ServerWebSockets.broadcast({ type: 'update', data: player.dataForPositionUpdate() });
            }
        }
        IncomingMessageQueue.removeProcessedMoveCommands();
    }

    static playerCollidesWithOthers(playerID, playerBounds) {
        let otherPlayers = ServerPlayersManager.getAllPlayersExcept(playerID);
        for (let otherPlayer of otherPlayers.values()) {
            if (this.rectsOverlap(playerBounds, otherPlayer.getBounds())) return true;
        }
        return false;
    }

    static rectsOverlap(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }
}