const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  description: "plays the next track",
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
    
    if (player.queue.size === 0) {
            const noMoreTracksEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('There are no more tracks in the queue to skip to.');
            return await interaction.editReply({ embeds: [noMoreTracksEmbed] });
    }
    player.stop();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("skipped to the next track."),
      ],
    });
  },
};
