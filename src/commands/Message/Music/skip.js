const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  permission: "",
  description: "plays the next track",
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

    if (player.queue.size === 0) {
            const noMoreTracksEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription('There are no more tracks in the queue to skip to.');
            return await message.channel.send({ embeds: [noMoreTracksEmbed] });
    }
    
    player.stop();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("skipped to the next track."),
      ],
    });
  },
};
