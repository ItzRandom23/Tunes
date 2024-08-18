const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "previous",
  aliases: ["prev", "back"],
  permission: "",
  description: "Plays the previous song",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message}}
   */
  run: async ({ client, message , player}) => {
    if (!player.queue.previous) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`There is no previous song.`),
        ],
      });
    }
    player.queue.unshift(player.queue.previous);
    player.stop();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Started playing the previous song.`),
      ],
    });
  },
};