const { SlashCommandBuilder } = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hello')
        .setDescription('Answer with world!'),
    async execute(interaction) {
        console.log("test")
        await interaction.reply('world!');
    },
};
