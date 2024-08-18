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
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message, player }) => {
    if (player) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              ` I'm already connected in <#${player.voiceChannel}>.`
            ),
        ],
      });
    }
    const permissions = message.member.voice.channel.permissionsFor(
      client.user.id
    );
    if (!permissions.has(PermissionFlagsBits.ViewChannel)) {
      return message.channel.send({
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
      return message.channel.send({
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
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              ` I don't have the permission to **speak** in your voice channel.`
            ),
        ],
      });
    }
    if (
      !message.guild.members.me.voice.channelId &&
      !message.member.voice.channel.joinable
    ) {
      return message.channel.send({
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
      guild: message.guildId,
      textChannel: message.channelId,
      voiceChannel: message.member?.voice.channelId,
      selfDeafen: true,
      volume: 100,
    });

    if (a.state !== "CONNECTED") a.connect();
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Connected in <#${message.member.voice.channelId}>`),
      ],
    });
  },
};
