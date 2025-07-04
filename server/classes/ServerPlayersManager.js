import { Player } from "../../shared/Player.js";

export class ServerPlayersManager {
    /** @type {Map<string, Player>} */
    static players = new Map();

    static addPlayer(player) {
        this.players.set(player.id, player);
    }

    static removePlayer(playerID) {
        this.players.delete(playerID);
    }

    static getPlayer(playerID) {
        return this.players.get(playerID);
    }

    static updatePlayerCoordinates(playerID, x, y) {
        let updatePlayer = this.players.get(playerID);
        if (updatePlayer) {
            updatePlayer.x = x;
            updatePlayer.y = y;
        }
    }

    static serializedPlayers() {
        let serializedPlayers = {};
        for (let [id, player] of this.players) {
            serializedPlayers[id] = player.dataToSend();
        }
        return serializedPlayers;
    }
}