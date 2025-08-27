const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("eval")
    .setDescription("tchiiiip")
    .addStringOption(opt =>
      opt.setName("code")
      .setDescription("xd").setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== "697896054607183882") {
      return interaction.reply({ content: "❌ You are not allowed to use this command.", ephemeral: true });
    }

    const input = interaction.options.getString("code");

    try {
      let output = await eval(input);
      if (typeof output !== "string") output = String(output);
      output = output.slice(0, 1900).replace(/`/g, "\\`").replace(/@/g, "@\u200b");

      await interaction.reply({ content: `\`\`\`js\n${output}\n\`\`\``, ephemeral: false });
    } catch (e) {
      const err = e.toString().slice(0, 1900);
      await interaction.reply({ content: `\`\`\`js\n${err}\n\`\`\``, ephemeral: true });
    }
  },
};
