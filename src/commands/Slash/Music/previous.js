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
    const currentTrack = player.queue.current;
    const previousTrack = player.queue.previous; // Assuming `queue.previous` gives the previous track
    const requester = currentTrack.requester;

    if (!previousTrack) {
      return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("There is no previous track."),
      ],
    });
    } else {
      player.previous();

      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("played the previous track."),
      ],
    });
    }
  },
};
