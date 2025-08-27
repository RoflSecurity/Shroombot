const { SlashCommandBuilder } = require("discord.js");
const { spawn } = require("child_process");

const OWNER_ID = `${process.env.BOT_OWNER}`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cli")
    .setDescription("Run a shell command (owner only)")
    .addStringOption(opt =>
      opt.setName("command").setDescription("Command to run").setRequired(true)
    ),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({ content: "Access denied.", ephemeral: true });
    }

    const cmd = interaction.options.getString("command");
    await interaction.deferReply();

    const proc = spawn("bash", ["-c", cmd], { shell: true });
    let output = "";

    const interval = setInterval(() => {
      interaction.editReply("```\n" + output.slice(-1900) + "\n```").catch(() => {});
    }, 2000);

    proc.stdout.on("data", chunk => {
      output += chunk.toString();
    });

    proc.stderr.on("data", chunk => {
      output += chunk.toString();
    });

    proc.on("close", code => {
      clearInterval(interval);
      if (!output) output = `[Process exited with code ${code}]`;
      interaction.editReply("```\n" + output.slice(-1900) + "\n```").catch(() => {});
    });

    proc.on("error", err => {
      clearInterval(interval);
      interaction.editReply("Error: " + err.message).catch(() => {});
    });
  }
};
