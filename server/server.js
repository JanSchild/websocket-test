import { ServerWebSocket } from './js/ServerWebSocket.js';

import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app = express();
let server = http.createServer(app);
ServerWebSocket.start(server);

app.use(express.static(path.join(__dirname, '../client')));
app.use('/shared', express.static(path.join(__dirname, '../shared')));

server.listen(3000, function () {
    console.log('Server running at http://localhost:3000');
});
