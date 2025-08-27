const { Events, EmbedBuilder } = require('discord.js');
const cooldown = {};
module.exports = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction, client) {
        const command = client.commands.get(interaction.commandName);
        if (!command || !interaction.isChatInputCommand()) { return };
        if (interaction.user.id !== process.env.BOT_OWNER) {return} ;
        if (cooldown[interaction.user.id] > Date.now()) { return interaction.reply({ content: 'Commands are subject to a 5 second cooldown ...', ephemeral: true }) }
        try {
            console.log(interaction.commandName + " will be executed");
            await command.execute(interaction)
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
            }
        } finally {
            cooldown[interaction.user.id] = Date.now() + 5000; setTimeout(() => { delete cooldown[interaction.user.id] }, 5000);
        }
    },
};
