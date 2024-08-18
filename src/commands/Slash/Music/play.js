const {
  ApplicationCommandOptionType,
  EmbedBuilder,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "play",
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
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction) => {
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
    let song = interaction.options.getString("query");
    if (!song) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `Please provide a search query. Use the command again with a query to proceed.`
            ),
        ],
      });
    }
    if (
      /^https?:\/\/?(?:www\.)?(?:(music|m|www)\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/.test(
        song
      )
    ) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `As of recent events, we have removed YouTube as a supported platform, please try using a different platform or provide a search query to use our default platform.`
            ),
        ],
      });
    }
    const player = client.manager.create({
      guild: interaction.guildId,
      textChannel: interaction.channelId,
      voiceChannel: interaction.member?.voice.channelId,
      selfDeafen: true,
      volume: 100,
    });

    if (player.state !== "CONNECTED") player.connect();

    const result = await player.search(song, interaction.member.user);

    switch (result.loadType) {
      case "empty":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Load failed when searching for \`${song}\``),
          ],
        });

      case "error":
        if (!player.queue.current) player.destroy();
        return await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`No matches when searching for \`${song}\``),
          ],
        });

      case "track":
        const track = result.tracks[0];
        if (!track.title || !track.uri || track.title.trim() === "") {
          return await interaction.editReply({
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

        return await interaction.editReply({
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
          return await interaction.editReply({
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

        return await interaction.editReply({
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
        return await interaction.editReply({
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
