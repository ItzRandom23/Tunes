const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
module.exports = {
    name: "pl-play",
    permission: "",
    description: "Play your favourite list",
    usage: "fav-play [position] [user]",
    settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
    options: [
        {
            name: "position",
            description: "The position of the song in your favourite list",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
        {
            name: 'user',
            description: 'The user you want to see play favourite list',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    
    run: async (client, interaction, dispatcher, guildData) => {
        let position = interaction.options.getInteger("position");
        const userRegex = /<@!?(\d{17,19})>/;
        if (userRegex.test(position)) {
            return await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Do you mean \`${guildData.prefix}fav-play all [user]\``),
                ],
            })
        }
        let user = interaction.options.getString("user");
        if (user && user.includes("<@") && user.includes(">")) user = user.replace(/[<@!>]/g, "");
        if (!user) user = interaction.member.id;
        let data = await favouriteSchema.findOne({ userID: user });
        if (!data) {
            data = new favouriteSchema({
                userID: interaction.member.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            });
        }
        await data.save();
        if (data.private && data.userID !== interaction.member.id) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`This user's playlist is private.`),
            ],
        });
        if (!data.songs.length) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        if (!dispatcher) {
      dispatcher = client.manager.create({
        guild: interaction.guildId,
        textChannel: interaction.channelId,
        voiceChannel: interaction.member?.voice.channelId,
        selfDeafen: true,
        volume: 100,
      });
      if (dispatcher.state !== "CONNECTED") dispatcher.connect();
    }

    const tracks = [];
    for (let i = 0; i < data.songs.length; i++) {
      const searchResult = await dispatcher.search(data.songs[i].url, interaction.member.user);
      if (searchResult.tracks.length > 0) {
        tracks.push(searchResult.tracks[0]);
      } else {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Failed to find a track for URL: ${data.songs[i].url}. Skipping...`
              ),
          ],
        });
      }
    }

    if (!dispatcher.queue.current) {
      dispatcher.queue.add(tracks);
      dispatcher.play();
    } else {
      dispatcher.queue.add(tracks);
    }
        return await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Added ${position ? "the song" : "all songs"} to the queue.`),
            ],
        })
    }
}