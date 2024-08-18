const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "replay",
  description: "Plays the song from starting",
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
    
    player.seek(0);
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Replaying the current song.`),
      ],
    });
  },
};