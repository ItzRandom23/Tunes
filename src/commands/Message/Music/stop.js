const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "stop",
  permission: "",
  description: "Stops the music",
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
            const embed = new EmbedBuilder()
                .setColor('#FFD700')
                .setDescription("I am not playing anything currently.")
            return message.reply({embeds: [embed]});
    }
    player.destroy();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("Stop playing music."),
      ],
    });
  },
};
