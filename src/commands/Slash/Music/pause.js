const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pause",
  description: "Pauses the current song",
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
    if (player.paused) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The Song is Already Paused.`),
        ],
      });
    }
    player.pause(true);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`⏸️ Paused the song.`),
      ],
    });
  },
};
