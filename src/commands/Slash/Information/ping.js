const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Shows the bot's latency",
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction) => {
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`API Latency - \`${Math.trunc(client.ws.ping)}\` ms`),
      ],
    });
  },
};
