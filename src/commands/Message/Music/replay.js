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
