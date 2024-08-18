const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  permission: "",
  aliases: ["disconnect", "dc", "leave"],
  description: "Leaves the voice channel",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message}}
   */
  run: async ({ client, message, player, guildData }) => {
    if (!player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`I am not connected to a voice channel.`),
        ],
      });
    }
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You must be in a voice channel to use this command.`
            ),
        ],
      });
    }

    player.destroy();

    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("👋 Disconnected from the VC."),
      ],
    });
  },
};
