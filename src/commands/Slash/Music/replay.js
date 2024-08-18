const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "replay",
  description: "Plays the song from the beginning",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction}}
   */
  run: async (client, interaction, player)  => {
    player.seek(0);
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Replaying the current song.`),
      ],
    });
  },
};
