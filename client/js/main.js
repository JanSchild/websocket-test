import { ClientPlayersManager } from './ClientPlayersManager.js';
import { ClientWebSocket } from './ClientWebSocket.js';

let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

ClientWebSocket.startNewSocket();

ClientWebSocket.on('message', (event) => {
    let msg = JSON.parse(event.data);

    switch (msg.type) {
        case "init":
            ClientPlayersManager.myID = msg.id;
            ClientPlayersManager.loadPlayersFromJSON(msg.players);
            break;
        case "player_joined":
            ClientPlayersManager.addPlayer(msg.player);
            break;
        case "player_left":
            ClientPlayersManager.removePlayer(msg.id);
            break;
        case "update":
            ClientPlayersManager.updatePlayerCoordinates(msg.id, msg.x, msg.y);
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

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let [id, player] of ClientPlayersManager.players) {
        let isMyself = ClientPlayersManager.myID == id;
        player.render(ctx, isMyself);
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();