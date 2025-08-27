const WebSocket = require('ws');

let wss = null;
const slaves = new Map(); // uuid -> ws

function startMasterServer(port = process.env.WS_PORT || 8080) {
    wss = new WebSocket.Server({ port });
    console.log(`[WS] Master server listening on port ${port}`);

    wss.on('connection', (ws, req) => {
        const uuid = req.url?.substring(1) || `slave-${Date.now()}`;
        slaves.set(uuid, ws);
        console.log(`[WS] Slave connected: ${uuid}`);

        ws.on('message', message => {
            console.log(`[WS][${uuid}] ${message}`);
        });

        ws.on('close', () => {
            slaves.delete(uuid);
            console.log(`[WS] Slave disconnected: ${uuid}`);
        });
    });
}

function sendToSlave(uuid, message) {
    const ws = slaves.get(uuid);
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(message);
}

function sendToAllSlaves(message) {
    for (const ws of slaves.values()) {
        if (ws.readyState === WebSocket.OPEN) ws.send(message);
    }
}

function getSlaves() {
    return Array.from(slaves.keys());
}

module.exports = { startMasterServer, sendToSlave, sendToAllSlaves, getSlaves };
