const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "previous",
  description: "replays the current track",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction, player) => {
    player.previous();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("played the previous track."),
      ],
    });
  },
};
