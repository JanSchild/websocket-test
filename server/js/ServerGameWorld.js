import { ServerPlayersManager } from "./ServerPlayersManager.js";

export class ServerGameWorld {
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