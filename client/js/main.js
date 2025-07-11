import { ClientGameLoop } from './ClientGameLoop.js';
import { ClientGameRenderer } from './ClientGameRenderer.js';
import { ClientPlayersManager } from './ClientPlayersManager.js';
import { ClientWebSocket } from './ClientWebSocket.js';

let canvas = document.getElementById('game');

ClientGameRenderer.initialize(canvas);
ClientGameLoop.start();

ClientWebSocket.startNewSocket();

ClientWebSocket.on('message', (event) => {
    let msg = JSON.parse(event.data);
    if (!msg.data) return;

    switch (msg.type) {
        case "init":
            ClientPlayersManager.myID = msg.data.playerID;
            ClientPlayersManager.loadPlayersFromJSON(msg.data.players);
            break;
        case "player_joined":
            ClientPlayersManager.addPlayer(msg.data.player);
            break;
        case "player_left":
            ClientPlayersManager.removePlayer(msg.data.playerID);
            break;
        case "update":
            ClientPlayersManager.updatePlayerCoordinates(msg.data.id, msg.data.x, msg.data.y);
            break;
    }
})

document.addEventListener('keydown', function (e) {
    let dir = null;
    if (e.key === 'ArrowLeft') dir = 'left';
    if (e.key === 'ArrowRight') dir = 'right';
    if (e.key === 'ArrowUp') dir = 'up';
    if (e.key === 'ArrowDown') dir = 'down';
    if (dir) {
        ClientWebSocket.send('move', { dir });
    }
});