const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "previous",
  permission: "",
  description: "plays the previous track",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ message: import("discord.js").Message }}
   */
  run: async ({ message, player }) => {
    const currentTrack = player.queue.current;
    const previousTrack = player.queue.previous; // Assuming `queue.previous` gives the previous track
    const requester = currentTrack.requester;

    if (!previousTrack) {
      return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("There is no previous track."),
      ],
    });
    } else {
      player.previous();

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription("played the previous track."),
      ],
    });
    }
  },
};
