const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "replay",
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
    if (!player.playing) {
      return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("I am not playing anything right now."),
      ],
    });
    }
    player.restart();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("replayed current track."),
      ],
    });
  },
};
