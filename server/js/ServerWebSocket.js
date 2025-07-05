import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../shared/Player.js';
import { ServerPlayersManager } from './ServerPlayersManager.js';

export class ServerWebSocket {
    static wss;

    static start(server) {
        ServerWebSocket.wss = new WebSocketServer({ server });

        ServerWebSocket.wss.on('connection', function connection(ws) {
            let id = uuidv4();
            let x = Math.random() * 400;
            let y = Math.random() * 400;
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            let player = new Player(id, x, y, color);
            ServerPlayersManager.addPlayer(player);
            ws.id = id;

            console.log(`Player joined`);
            ws.send(JSON.stringify({ type: 'init', id, players: ServerPlayersManager.serializedPlayers() }));

            // Notify others of new player
            ServerWebSocket.broadcast({ type: 'player_joined', player });

            ws.on('message', function incoming(message) {
                console.log(`Incoming message: ` + message);
                let msg = JSON.parse(message);
                if (msg.type === 'move') {
                    let p = ServerPlayersManager.getPlayer(ws.id);
                    if (!p) return;

                    p.move(msg.data.dir);

                    ServerWebSocket.broadcast({ type: 'update', id: ws.id, x: p.x, y: p.y });
                }
            });

            ws.on('close', function () {
                ServerPlayersManager.removePlayer(ws.id);
                ServerWebSocket.broadcast({ type: 'player_left', id: ws.id });
            });
        });
    }

    static broadcast(data) {
        let json = JSON.stringify(data);
        ServerWebSocket.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(json);
            }
        });
    }
}