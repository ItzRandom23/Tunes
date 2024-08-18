const {
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const guildDB = require("../schema/Guild");

/**
 * @param {import("../structures/Client")} client
 * @param {import('discord.js').CommandInteraction} interaction
 */

module.exports = async (client, interaction) => {
  if (!client.isReady() || !interaction.guild?.available) return;
  if (interaction instanceof ChatInputCommandInteraction) {
    let guildData = async () => {
      if (await guildDB.findOne({ id: interaction.guildId })) {
        return await guildDB.findOne({ id: interaction.guildId });
      } else {
        return new guildDB({ id: interaction.guildId }).save();
      }
    };
    guildData = await guildData();
    const prefix = guildData.prefix;
    const command = client.slashCommands.get(interaction.commandName);

    if (command) {
      await interaction.deferReply();

      if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.SendMessages
        ) ||
        !interaction.channel
          .permissionsFor(client.user.id)
          .has(PermissionFlagsBits.SendMessages)
      ) {
        const user = await interaction.guild?.members.fetch(
          interaction.member.id
        );
        if (!user.dmChannel) await user.createDM();
        return await user.dmChannel
          ?.send({
            embeds: [
              {
                description: `Please grant me the \`Send Messages\` permission in <#${interaction.channelId}> - **${interaction.guild.name}** first.`,
              },
            ],
          })
          .then(() => interaction.deleteReply());
      }
      if (
        !interaction.channel
          .permissionsFor(client.user.id)
          .has(PermissionFlagsBits.ViewChannel)
      )
        return;
      if (
        !interaction.channel
          .permissionsFor(client.user.id)
          .has(PermissionFlagsBits.ReadMessageHistory)
      )
        return;
      if (
        command.settings.ownerOnly &&
        !client.owner.includes(interaction.member.id)
      )
        return;
      if (
        !interaction.guild.members.me.permissions.has(
          PermissionFlagsBits.EmbedLinks
        ) ||
        !interaction.channel
          .permissionsFor(client.user.id)
          .has(PermissionFlagsBits.EmbedLinks)
      ) {
        return interaction.followUp({
          content: `Please grant me the \`Embed Links\` permission in <#${interaction.channelId}> first.`,
        });
      }
      if (
        command.permission &&
        !interaction.member.permissions.has(
          PermissionFlagsBits[command.permission]
        ) &&
        !client.owner.includes(interaction.member.id)
      ) {
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `You do not have the required \`${command.permission}\` permission to use this command.`
              ),
          ],
        });
      }

      if (
        command.settings.inVoiceChannel &&
        !interaction.member.voice.channelId
      ) {
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Please join a voice channel before using this command.`
              ),
          ],
        });
      }
      if (
        command.settings.sameVoiceChannel &&
        interaction.guild.members.me.voice.channelId &&
        interaction.guild.members.me.voice.channelId !==
          interaction.member.voice.channelId
      ) {
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `You must be in the same voice channel as <@${client.user.id}> to use this command.`
              ),
          ],
        });
      }
      let player = client.manager.get(interaction.guildId);
      if (
        (command.settings.musicnotplaying && !player) ||
        (command.settings.musicplaying && !player.queue.current)
      ) {
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Please start playing something before using this command.`
              ),
          ],
        });
      }

      if (
        client.util.cooldown(interaction.member.id, command) &&
        !client.owner.includes(interaction.member.id)
      ) {
        let timeLeft = client.util.cooldown(interaction.member.id, command);
        return interaction.followUp({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Please wait ${timeLeft} before using this command again as it is on cooldown.`
              ),
          ],
        });
      }
      try {
        await command.run(client, interaction, player, guildData, prefix);
      } catch (error) {
        if (interaction.replied) {
          await interaction
            .editReply({
              content: `An unexpected error occurred.`,
            })
            .catch(() => {});
        } else {
          await interaction
            .reply({
              ephemeral: true,
              content: `An unexpected error occurred.`,
            })
            .catch(() => {});
        }
        console.error(error);
      }
    }
  }
};
