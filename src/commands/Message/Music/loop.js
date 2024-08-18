const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["repeat"],
  description: "Toggle looping of the current song.",
  usage: "<prefix>loop <enable|disable>",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message, player }) => {
    const args = message.content.split(' ').slice(1);
    const mode = args[0];

    if (!player) {
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("I am not connected to any Voice Channel.");
      return message.channel.send({ embeds: [embed] });
    }

    if (!player.playing) {
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("No song is playing right now.");
      return message.channel.send({ embeds: [embed] });
    }

    if (mode === 'enable') {
      player.setTrackRepeat(true);
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("Song is now on loop.");
      return message.channel.send({ embeds: [embed] });
    }

    if (mode === 'disable') {
      player.setTrackRepeat(false);
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("Song is no longer on loop.");
      return message.channel.send({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setDescription("Invalid mode specified. Use `enable` or `disable`.");
    return message.channel.send({ embeds: [embed] });
  },
};
