const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "join",
  aliases: ["j"],
  permission: "",
  description: "Makes the bot join your voice channel",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction}}
   */
  run: async (client, interaction, player) => {
    if (player) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I'm already connected in <#${player.voiceChannel}>.`
            ),
        ],
      });
    }

    const permissions = interaction.member.voice.channel.permissionsFor(
      client.user.id
    );

    if (!permissions.has(PermissionFlagsBits.ViewChannel)) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I don't have the permission to **view** your voice channel.`
            ),
        ],
      });
    }

    if (!permissions.has(PermissionFlagsBits.Connect)) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I don't have the permission to **connect** to your voice channel.`
            ),
        ],
      });
    }

    if (!permissions.has(PermissionFlagsBits.Speak)) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I don't have the permission to **speak** in your voice channel.`
            ),
        ],
      });
    }

    if (
      !interaction.guild.members.me.voice.channelId &&
      !interaction.member.voice.channel.joinable
    ) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `I can't join your voice channel because it's full.`
            ),
        ],
      });
    }

    const a = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member?.voice.channelId,
      selfDeafen: true,
      volume: 100,
    });

    if (a.state !== "CONNECTED") a.connect();

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `Connected in <#${interaction.member.voice.channelId}>.`
          ),
      ],
    });
  },
};
