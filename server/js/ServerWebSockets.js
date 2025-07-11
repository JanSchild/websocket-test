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
            let width = 30;
            let height = 30;
            let speed = 5;
            let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            let player = new Player(id, x, y, width, height, speed, color);
            ServerPlayersManager.addPlayer(player);
            ws.id = id;

            console.log(`Player joined`);
            let initMsg = { type: 'init', data: { playerID: id, players: ServerPlayersManager.totalPlayersData() } };
            ws.send(JSON.stringify(initMsg));

            // Notify others of new player
            let playerJoinedMsg = { type: 'player_joined', data: { player } };
            ServerWebSockets.broadcast(playerJoinedMsg);

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
                let playerLeftMsg = { type: 'player_left', data: { playerID: ws.id } };
                ServerWebSockets.broadcast(playerLeftMsg);
            });
        });
    }

    static broadcast(message) {
        let json = JSON.stringify(message);
        ServerWebSockets.wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(json);
            }
        });
    }
}