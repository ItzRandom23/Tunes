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
    player.previous();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("played the previous track."),
      ],
    });
  },
};
