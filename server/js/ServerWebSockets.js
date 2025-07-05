import WebSocket, { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../shared/Player.js';
import { ServerPlayersManager } from './ServerPlayersManager.js';
import { IncomingMessage } from './IncomingMessage.js';
import { IncomingMessageQueue } from './IncomingMessageQueue.js';

export class ServerWebSockets {
    static wss;

    static start(server) {
        ServerWebSockets.wss = new WebSocketServer({ server });

        ServerWebSockets.wss.on('connection', function connection(ws) {
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
            ServerWebSockets.broadcast({ type: 'player_joined', player });

            ws.on('message', function incoming(message) {
                console.log(`Incoming message: ` + message);
                let msg = JSON.parse(message);
                if (msg.type === 'move') {
                    let incomingMsg = new IncomingMessage(ws.id, 'move', msg.data, performance.now());
                    IncomingMessageQueue.addToMoveCommandQueue(incomingMsg);
                }
            });

            ws.on('close', function () {
                ServerPlayersManager.removePlayer(ws.id);
                ServerWebSockets.broadcast({ type: 'player_left', id: ws.id });
            });
        });
    }

    static broadcast(data) {
        let json = JSON.stringify(data);
        ServerWebSockets.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(json);
            }
        });
    }
}