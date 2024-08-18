const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "leave",
  permission: "",
  description: "Leave the voice channel.",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction, player: any, guildData: any }}
   */
  run: async (client, interaction, player) => {
    if (!player) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`I'm not connected to any voice channel.`),
        ],
      });
    }

    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You need to be in a voice channel to use this command.`
            ),
        ],
      });
    }

    player.destroy();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription("👋 Disconnected from the voice channel."),
      ],
    });
  },
};
