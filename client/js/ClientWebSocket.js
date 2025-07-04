export class ClientWebSocket {
    static startNewSocket() {
        this.socket = new WebSocket("ws://" + window.location.host);
    }

    static send(type, data) {
        if (!this.socket || !type || !data) {
            return;
        }
        this.socket.send(JSON.stringify({ type, data }));
    }
}