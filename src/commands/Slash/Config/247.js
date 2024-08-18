const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "247",
  permission: "ManageGuild",
  description: "Toggle 24/7 mode for the bot.",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction, player, guildData) => {
    let toBeEnabled = !guildData.alwaysinvc.enabled;

    guildData.alwaysinvc.enabled = toBeEnabled;
    guildData.alwaysinvc.textChannel = toBeEnabled
      ? interaction.channel.id
      : null;
    guildData.alwaysinvc.voiceChannel = toBeEnabled
      ? interaction.member.voice.channel.id
      : null;
    guildData.save();

    if (toBeEnabled && !player) {
      player = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member?.voice.channelId,
        selfDeafen: true,
        volume: 100,
      });
      if (player.state !== "CONNECTED") player.connect();
    } else if (!toBeEnabled && player && !player.queue.current) {
      setTimeout(() => player.destroy(), 150);
    }

    return interaction.editReply({
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
