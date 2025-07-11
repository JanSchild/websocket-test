import { Player } from "../../shared/Player.js";
import { v4 as uuidv4 } from 'uuid';

export class ServerPlayersManager {
    /** @type {Map<string, Player>} */
    static players = new Map();
    
    static generatePlayer() {
        let id = uuidv4();
        let x = Math.random() * 400;
        let y = Math.random() * 400;
        let width = 30;
        let height = 30;
        let speed = 5;
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        let player = new Player(id, x, y, width, height, speed, color);
        return player;
    }

    static addPlayer(player) {
        this.players.set(player.id, player);
    }

    static removePlayer(playerID) {
        this.players.delete(playerID);
    }

    static getPlayer(playerID) {
        return this.players.get(playerID);
    }

    static totalPlayersData() {
        let serializedPlayers = {};
        for (let [id, player] of this.players) {
            serializedPlayers[id] = player.dataForFullSync();
        }
        return serializedPlayers;
    }

    static getAllPlayersExcept(playerID) {
        return new Map(
            Array.from(ServerPlayersManager.players.entries()).filter(([id]) => id !== playerID)
        );
    }
}