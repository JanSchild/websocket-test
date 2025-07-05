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
            player.move(moveCommand.data.dir);
            ServerWebSockets.broadcast({ type: 'update', id: player.id, x: player.x, y: player.y });
        }
        IncomingMessageQueue.removeProcessedMoveCommands();


        // 1. Update player positions (if moving)
        // 2. Check for collisions
        // 3. Broadcast updated game state to all clients

        //checkCollisions();
        //broadcastGameState();
    }
}