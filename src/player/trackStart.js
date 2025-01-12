const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { convertTime } = require('../structures/convertTime')

module.exports = async (client, player, track) => {
  const guild = client.guilds.cache.get(player.guild);
  const source = client.manager.get(player.guild);
  if (!guild) return;
  const textChannel = client.channels.cache.get(player.textChannel);
  if (!textChannel) return;

  if (source.textChannel == textChannel) {
    let embed = new EmbedBuilder()
      .setColor(`Blue`)
      .setAuthor({ name: "Now Playing", iconURL: track.requester.displayAvatarURL() })
      .setDescription(` 💿 [${track.title}](${track.uri})\n 👤 Requester: [${track.requester}]\n ⏲️ Duration: \`${convertTime(track.duration)}\``);
    const skipButton = new ButtonBuilder()
      .setCustomId('skip')
      .setEmoji('⏭️')
      .setStyle(ButtonStyle.Secondary)
    const stopButton = new ButtonBuilder()
      .setCustomId('stop')
      .setEmoji('⏹️')
      .setStyle(ButtonStyle.Danger)
    const pauseResume = new ButtonBuilder()
      .setCustomId('pr')
      .setEmoji('⏸️')
      .setStyle(ButtonStyle.Secondary)
    const volp = new ButtonBuilder()
      .setCustomId('vol+')
      .setEmoji(`🔊`)
      .setStyle(ButtonStyle.Secondary)
    const vold = new ButtonBuilder()
      .setCustomId('vol-')
      .setEmoji('🔉')
      .setStyle(ButtonStyle.Secondary)

    const row = new ActionRowBuilder().addComponents(vold, stopButton, pauseResume, skipButton, volp)

    let msg = await textChannel
      .send({
        embeds: [embed],
        components: [row]
      })
      .catch(() => null);
    if (!msg) return;
    player.setNowPlayingMessage(msg);

    const collector = msg.createMessageComponentCollector()

    collector.on('collect', async i => {
      if (!i.member.voice.channel || player.voiceChannel !== i.member.voice.channel.id) {
        return i.reply({ content: `You must be in the same voice channel as the bot.`, ephemeral: true })
      }

      if (i.isButton) {
        if (i.customId === 'vol-') {
          if (!player) {
            collector.stop()
          } else if (player.volume < 20) {
            await player.setVolume(10)
            i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Volume can't be lower than: \`10%\``)],
              ephemeral: true
            })
          } else {
            await player.setVolume(player.volume - 10)

            await i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Volume has been set to: \`${player.volume}%\``)],
              ephemeral: true
            })
          }
        } else if (i.customId === 'stop') {
          if (!player) {
            collector.stop()
          } else {
            i.deferUpdate()
            await player.destroy()
          }
        } else if (i.customId === 'pr') {
          if (!player) {
            collector.stop()
          } else if (player.paused) {
            player.pause(false)
            pauseResume.setEmoji('⏸️')
            await i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Song has been resumed!`)],
              ephemeral: true
            })
            await msg.edit({ components: [row] })
          } else {
            player.pause(true)
            pauseResume.setEmoji('▶️')
            await i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Song has been paused!`)],
              ephemeral: true
            })
            await msg.edit({ components: [row] })
          }
        } else if (i.customId === 'skip') {
          if (!player) {
            collector.stop()
          } else if (!player.queue.size || player.queue.size === 0) {
            return await i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`There is no songs in queue to skip!`)],
              ephemeral: true
            })
          } else {
            await player.stop();
          }
        } else if (i.customId === 'vol+') {
          if (!player) {
            collector.stop()
          } else if (player.volume > 90) {
            await player.setVolume(100)

            await i.reply({ embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Volume can't be higher than: \`100%\``)], ephemeral: true })
          } else {
            await player.setVolume(player.volume + 10)
            await i.reply({
              embeds: [new EmbedBuilder().setColor('Blue').setDescription(`Volume has been set to: \`${player.volume}%\``)],
              ephemeral: true
            })
          }
        }
      }

    })

  }
};
