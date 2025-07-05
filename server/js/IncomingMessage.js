export class IncomingMessage {
    constructor(playerID, type, data, timestamp) {
        this.playerID = playerID;
        this.type = type;
        this.data = data;
        this.timestamp = timestamp;
        this.processed = false;
    }
}