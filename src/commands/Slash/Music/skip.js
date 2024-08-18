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
    if (!player.playing) {
      return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("I am not playing anything right now."),
      ],
    });
    }
    const currentTrack = player.queue.current;
    if (player.queue.size === 0) {
            const noMoreTracksEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('There are no more tracks in the queue to skip to.');
            return await message.channel.send({ embeds: [noMoreTracksEmbed] });
    }
    player.stop();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("played the previous track."),
      ],
    });
  },
};
