const { Events } = require('discord.js');
const { startMasterServer } = require('../ws/masterServer');
const { initDB } = require('../db/mysql');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        startMasterServer();
        try {
            await initDB();
        } catch (err) {
            console.error('[DB] Could not initialize database:', err);
        }
    }
};
