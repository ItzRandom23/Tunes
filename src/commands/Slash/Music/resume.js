const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  description: "Resumes the current song",
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
    if (!player.paused) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The Song is Already Playing.`),
        ],
      });
    }
    player.pause(false);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`▶️ Resumed the song.`),
      ],
    });
  },
};
