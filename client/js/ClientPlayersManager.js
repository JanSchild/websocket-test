import { ClientPlayer } from "./ClientPlayer.js";

export class ClientPlayersManager {
    /** @type {Map<string, ClientPlayer>} */
    static players = new Map();
    static myID;

    static loadPlayersFromJSON(playersJSON) {
        this.players = new Map(
            Object.entries(playersJSON)
                .map(([id, data]) => [id, ClientPlayer.fromJSON(data)])
        );
    }

    static addPlayer(player) {
        let newPlayerID = player.id;
        let newPlayer = ClientPlayer.fromJSON(player);
        this.players.set(newPlayerID, newPlayer);
    }

    static removePlayer(playerID) {
        this.players.delete(playerID);
    }

    static updatePlayerCoordinates(playerID, x, y) {
        if (this.players.has(playerID)) {
            let updatePlayer = this.players.get(playerID);
            updatePlayer.x = x;
            updatePlayer.y = y;
        }
    }
}