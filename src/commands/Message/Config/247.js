const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "247",
  aliases: ["24/7", "24_7", "24h"],
  permission: "ManageGuild",
  description: "Toggle 24/7 mode for the bot.",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message, player, guildData }) => {
    let toBeEnabled = !guildData.alwaysinvc.enabled;
    if (toBeEnabled) {
      guildData.alwaysinvc.enabled = true;
      guildData.alwaysinvc.textChannel = message.channel.id;
      guildData.alwaysinvc.voiceChannel = message.member.voice.channel.id;
      guildData.save();

      if (!player) {
        const a = client.manager.create({
          guild: message.guildId,
          textChannel: message.channelId,
          voiceChannel: message.member?.voice.channelId,
          selfDeafen: true,
          volume: 100,
        });
        if (a.state !== "CONNECTED") a.connect();
      }
    } else {
      guildData.alwaysinvc.enabled = false;
      guildData.alwaysinvc.textChannel = null;
      guildData.alwaysinvc.voiceChannel = null;
      guildData.save();

      if (player && !player.queue.current) {
        setTimeout(() => player.destroy(), 150);
      }
    }
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `24/7 mode has been ${
              toBeEnabled ? "**enabled**" : "**disabled**"
            }.`
          ),
      ],
    });
  },
};
