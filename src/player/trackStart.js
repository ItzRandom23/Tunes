const { EmbedBuilder } = require("discord.js");

module.exports = async (client, player, track) => {
  const guild = client.guilds.cache.get(player.guild);
  const source = client.manager.get(player.guild);
  if (!guild) return;
  const textChannel = client.channels.cache.get(player.textChannel);
  if (!textChannel) return;

  if (source.textChannel == textChannel) {
    let embed = new EmbedBuilder()
      .setColor(`Blue`)
      .setAuthor({ name: "Now Playing" })
      .setDescription(`[${track.title}](${track.uri}) [${track.requester}]`);
    let msg = await textChannel
      .send({
        embeds: [embed],
      })
      .catch(() => null);
    if (!msg) return;
    player.setNowPlayingMessage(msg);
  }
};
