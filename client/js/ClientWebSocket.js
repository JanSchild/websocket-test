export class ClientWebSocket {
    static socket;
    static eventHandlers = {};
    static url = "ws://" + window.location.host;

    static startNewSocket() {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener('open', (event) => {
            console.log('Connected');
            this._emit('open', event);
        });

        this.socket.addEventListener('message', (event) => {
            this._emit('message', event);
        });

        this.socket.addEventListener('close', (event) => {
            console.log('Disconnected');
            this._emit('close', event);
        });

        this.socket.addEventListener('error', (event) => {
            console.error('WebSocket error:', event);
            this._emit('error', event);
        });
    }

    static on(eventName, callback) {
        if (!this.eventHandlers[eventName]) this.eventHandlers[eventName] = [];
        this.eventHandlers[eventName].push(callback);
    }

    static _emit(eventName, event) {
        if (this.eventHandlers[eventName]) {
            this.eventHandlers[eventName].forEach(callback => callback(event));
        }
    }

    static send(type, data) {
        if (!this.socket || !type || !data) {
            return;
        }
        let payload = JSON.stringify({ type, data });
        if (this.socket.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket not open. Cannot send: ', payload);
            return;
        }
        this.socket.send(payload);
    }

    static disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}