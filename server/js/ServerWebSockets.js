import WebSocket, { WebSocketServer } from 'ws';
import { Player } from '../../shared/Player.js';
import { ServerPlayersManager } from './ServerPlayersManager.js';
import { IncomingMessage } from './IncomingMessage.js';
import { IncomingMessageQueue } from './IncomingMessageQueue.js';

export class ServerWebSockets {
    static wss;

    static start(server) {
        ServerWebSockets.wss = new WebSocketServer({ server });

        ServerWebSockets.wss.on('connection', function connection(ws) {
            let player = ServerPlayersManager.generatePlayer();
            ServerPlayersManager.addPlayer(player);
            ws.id = player.id;

            console.log(`Player joined`);
            let initMsg = { type: 'init', data: { playerID: ws.id, players: ServerPlayersManager.totalPlayersData() } };
            ws.send(JSON.stringify(initMsg));

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