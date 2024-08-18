const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "resume",
  permission: "",
  description: "Resumes the current song",
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
    if (!player.paused) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`The Song is Already Playing.`),
        ],
      });
    }
    player.pause(false);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`▶️ Resumed the song.`),
      ],
    });
  },
};
