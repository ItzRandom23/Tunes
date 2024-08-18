const {
  EmbedBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const guildDB = require("../schema/Guild");

/**
 * @param {import("../structures/Client")} client
 * @param {import("discord.js").Message} message
 */

module.exports = async (client, message) => {
  if (!client.isReady() || !message.guild?.available) return;
  if (!message.guild) {
    console.log("Message is not from a guild");
    return;
  }

  let guildData = async () => {
    if (await guildDB.findOne({ id: message.guild.id })) {
      return await guildDB.findOne({ id: message.guild.id });
    } else {
      return new guildDB({ id: message.guild.id }).save();
    }
  };
  guildData = await guildData();
  let { prefix } = guildData;

  const buttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.gg/cool-music-support-925619107460698202`),
    new ButtonBuilder()
      .setLabel("Invite")
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=12888394808&scope=bot%20identify%20applications.commands`
      ),
    new ButtonBuilder()
      .setLabel("Vote")
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discordbotlist.com/bots/cool-music-5612/upvote`)
  );

  if (
    [`<@!${client.user.id}>`, `<@${client.user.id}>`].includes(message.content)
  ) {
    if (message.author.bot) return;

    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setThumbnail(client.user.displayAvatarURL())
          .setAuthor({
            name: `Tunes`,
            iconURL: client.user.displayAvatarURL(),
          })
          .setDescription(
            `Discover the ultimate music bot! Packed with features and delivering high-quality music 24/7.\n\nPrefix: \`${guildData.prefix}\``
          ),
      ],
      components: [buttons],
    });
  }

  prefix = message.content.startsWith(`<@${client.user.id}>`)
    ? `<@${client.user.id}>`
    : prefix;
  if (message.author.bot) return;

  prefix = guildData.prefix;

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
  );
  if (!prefixRegex.test(message.content)) return;
  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");
  const commandName = cmd.toLowerCase();
  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  const { aliases } = command;
  const commandToExecute =
    client.commands.get(command) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(command));

  if (command) {
    if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits.SendMessages
      ) ||
      !message.channel
        .permissionsFor(client.user.id)
        .has(PermissionFlagsBits.SendMessages)
    ) {
      const user = await message.guild?.members.fetch(message.author.id);
      if (!user.dmChannel) await user.createDM();
      return await user.dmChannel?.send({
        embeds: [
          {
            description: `Please grant me the \`Send Messages\` permission in <#${message.channelId}> - **${message.guild.name}** before using commands.`,
          },
        ],
      });
    }
    if (
      !message.channel
        .permissionsFor(client.user.id)
        .has(PermissionFlagsBits.ViewChannel)
    )
      return;
    if (
      !message.channel
        .permissionsFor(client.user.id)
        .has(PermissionFlagsBits.ReadMessageHistory)
    )
      return;
    if (command.settings.ownerOnly && !client.owner.includes(message.member.id))
      return;
    if (
      !message.guild.members.me.permissions.has(
        PermissionFlagsBits.EmbedLinks
      ) ||
      !message.channel
        .permissionsFor(client.user.id)
        .has(PermissionFlagsBits.EmbedLinks)
    ) {
      return message.channel.send({
        content: `Please grant me the \`Embed Links\` permission in <#${message.channelId}> to use this command.`,
      });
    }

    if (
      command.permission &&
      !message.member.permissions.has(
        PermissionFlagsBits[command.permission]
      ) &&
      !client.owner.includes(message.member.id)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You do not have the \`${command.permission}\` permission to use this command.`
            ),
        ],
      });
    }
    if (command.settings.inVoiceChannel && !message.member.voice.channelId) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`You need to join a voice channel first.`),
        ],
      });
    }
    if (
      command.settings.sameVoiceChannel &&
      message.guild.members.me.voice.channelId &&
      message.guild.members.me.voice.channelId !==
        message.member.voice.channelId
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You must be in the same voice channel as <@${client.user.id}>.`
            ),
        ],
      });
    }
    let player = client.manager.get(message.guildId);
    if (
      (command.settings.musicnotplaying && !player) ||
      (command.settings.musicplaying && !player.queue.current)
    ) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `Please start playing a song before using this command.`
            ),
        ],
      });
    }
    if (
      client.util.cooldown(message.member.id, command) &&
      !client.owner.includes(message.member.id)
    ) {
      let timeLeft = client.util.cooldown(message.member.id, command);

      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `You must wait ${timeLeft} before using this command again.`
            ),
        ],
      });
    }
    if (
      prefix === `<@${client.user.id}>` &&
      !args[0]?.includes(`<@${client.user.id}>`)
    ) {
      const array = [...message.mentions.members.values()];
      array.shift();
      message.mentions.members.clear();
      for (let i = 0; i < array.length; i++) {
        message.mentions.members.set(array[i].id, array[i]);
      }
    }

    message.args = args;
    message.isInteraction = false;

    try {
      await command.run({ client, message, player, guildData, prefix });
    } catch (error) {
      console.error("Error executing command:", error);

      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `An error occurred while executing the command:\n\`\`\`${error}\`\`\``
            ),
        ],
      });
    }
  }
};
