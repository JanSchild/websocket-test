import { Player } from '../shared/Player.js';

import express from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();
let server = http.createServer(app);
let wss = new WebSocketServer({ server });

/** @type {Map<string, Player>} */
let players = new Map();

app.use(express.static(path.join(__dirname, '../client')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));

wss.on('connection', function connection(ws) {
    let id = uuidv4();
    let x = Math.random() * 400;
    let y = Math.random() * 400;
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    let player = new Player(id, x, y, color);
    players.set(id, player);
    ws.id = id;

    console.log(`Player joined`);

    let serializedPlayers = {};
    for (let [id, player] of players) {
        serializedPlayers[id] = player.dataToSend();
    }
    ws.send(JSON.stringify({ type: 'init', id, players: serializedPlayers }));

    // Notify others of new player
    broadcast({ type: 'player_joined', player });

    ws.on('message', function incoming(message) {
        console.log(`Incoming message: ` + message);
        let msg = JSON.parse(message);
        if (msg.type === 'move') {
            let p = players.get(ws.id);
            if (!p) return;

            p.move(msg.data.dir);

            broadcast({ type: 'update', id: ws.id, x: p.x, y: p.y });
        }
    });

    ws.on('close', function () {
        players.delete(ws.id);
        broadcast({ type: 'player_left', id: ws.id });
    });
});

function broadcast(data) {
    let json = JSON.stringify(data);
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(json);
        }
    });
}

server.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});
