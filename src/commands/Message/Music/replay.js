const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "replay",
  permission: "",
  description: "replays the current track",
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
    if (!player.playing) {
      return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Red")
          .setDescription("I am not playing anything right now."),
      ],
    });
    }
    player.restart();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("Replayed the current track."),
      ],
    });
  },
};
