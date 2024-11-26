const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "Plays the specified song",
  permission: "",
  usage: "<song's name/url>",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
  options: [
    {
      name: "query",
      description: "The song's name or URL",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
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
              `I don't have the permission to **speak** in your voice channel.`
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
    let song = message.args.join(" ");
    if (!song) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `Please provide a search query. Use the command again with a query to proceed.`
            ),
        ],
      });
    }
    const player = client.manager.create({
      guild: message.guildId,
      textChannel: message.channelId,
      voiceChannel: message.member?.voice.channelId,
      selfDeafen: true,
      volume: 100,
    });

    if (player.state !== "CONNECTED") player.connect();

    const result = await player.search(song, message.member.user);

    switch (result.loadType) {
      case "empty":
        if (!player.queue.current) player.destroy();
        return await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Load failed when searching for \`${song}\``),
          ],
        });

      case "error":
        if (!player.queue.current) player.destroy();
        return await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`No matches when searching for \`${song}\``),
          ],
        });

      case "track":
        const track = result.tracks[0];
        if (!track.title || !track.uri || track.title.trim() === "") {
          return await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Failed to add the song to the queue.`),
            ],
          });
        }
        player.queue.add(result.tracks[0]);

        if (!player.playing && !player.paused && !player.queue.length) {
          await player.play();
        }

        return await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(
                `Added [${result.tracks[0].title}](${result.tracks[0].uri}) to the queue.`
              ),
          ],
        });

      case "playlist":
        if (!result.playlist?.tracks) return;
        const validTracks = result.playlist.tracks.filter(
          (track) => track.title && track.uri && track.title.trim() !== ""
        );

        if (!validTracks.length) {
          return await message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Failed to add the playlist to the queue.`),
            ],
          });
        }

        player.queue.add(validTracks);

        if (
          !player.playing &&
          !player.paused &&
          player.queue.size === validTracks.length
        ) {
          await player.play();
        }

        return await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(
                `Added [${result.playlist.name}](${song}) playlist to the queue.`
              ),
          ],
        });

      case "search":
        player.queue.add(result.tracks[0]);
        if (!player.playing && !player.paused && !player.queue.length) {
          await player.play();
        }
        return await message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(
                `Added [${result.tracks[0].title}](${result.tracks[0].uri}) to the queue.`
              ),
          ],
        });
    }
  },
};
