const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "pause",
  permission: "",
  description: "Pauses the current song",
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
    if (player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The Song is Already Paused.`),
        ],
      });
    }
    player.pause(true);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`⏸️ Paused the song.`),
      ],
    });
  },
};
