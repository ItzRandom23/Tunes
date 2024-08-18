const { ChannelType, EmbedBuilder } = require("discord.js");
const guildDB = require("../schema/Guild");

/**
 * @param {import("../structures/Client")} client
 * @param {import("discord.js").VoiceState} oldState
 * @param {import("discord.js").VoiceState} newState
 */

module.exports = async (client, oldState, newState) => {
  if (newState.member && newState.member.id === client.user.id) {
    if (!newState.channelId) {
      let guildData = await guildDB.findOne({ id: newState.guild.id });
      if (!guildData) {
        return;
      }

      if (guildData.alwaysinvc && guildData.alwaysinvc.enabled) {
        setTimeout(() => {
          const player = client.manager.create({
            guild: guildData.id,
            textChannel: guildData.alwaysinvc.textChannel,
            voiceChannel: guildData.alwaysinvc.voiceChannel,
            selfDeafen: true,
            volume: 100,
          });
          if (!player.voiceChannel) {
            return;
          }
          if (player.state !== "CONNECTED") {
            return player.connect();
          }
        }, 500);
      }
    } else {
      if (
        newState.channel.type === ChannelType.GuildStageVoice &&
        newState.guild.members.me?.voice.suppress
      ) {
        newState.setSuppressed(false).catch(() => null);
      }
      if (!client.manager.get(newState.guild.id)) return;
      const player = client.manager.get(newState.guild.id);
      player.voiceChannel = newState.channelId;
      if (player.paused) return;
      player.pause(true);
      setTimeout(() => {
        player.pause(false);
      }, 150);
    }
  }
  let guildData = await guildDB.findOne({ id: newState.guild.id });
  if (
    !newState.channelId &&
    oldState.channelId === newState.guild.members.me?.voice.channelId &&
    client.manager.get(newState.guild.id) &&
    !newState.guild.members.me?.voice.channel.members.filter(
      ({ user: { bot } }) => !bot
    ).size &&
    !guildData.alwaysinvc.enabled
  ) {
    setTimeout(async () => {
      guildData = await guildDB.findOne({ id: newState.guild.id });
      if (
        client.manager.get(newState.guild.id) &&
        oldState.channelId ===
          client.guilds.cache.get(newState.guild.id)?.members.me?.voice
            .channelId &&
        !client.guilds.cache
          .get(newState.guild.id)
          ?.members.me?.voice.channel.members.filter(
            ({ user: { bot } }) => !bot
          ).size &&
        !guildData.alwaysinvc.enabled
      ) {
        const player = client.manager.get(newState.guild.id);

        if (player && player.textChannel) {
          try {
            const textChannel = await client.channels.fetch(player.textChannel);
            if (textChannel && textChannel.isText()) {
              const m = await textChannel.send({
                embeds: [
                  new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(
                      `Disconnected due to inactivity. To prevent this, enable 24/7 mode.`
                    ),
                ],
              });
              setTimeout(async () => await m.delete(), 50000);
            }
          } catch (error) {
            console.error(`Failed to send or delete message: ${error}`);
          }
        }

        player.destroy();
      }
    }, 30000);
  }
};
