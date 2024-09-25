const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
module.exports = {
    name: "pl-add",
    description: "Add a song to your playlist",
    settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
    
    
    run: async (client, interaction, dispatcher) => {
         
        let subcommand = interaction.options.getSubcommand();
        switch (subcommand) {
            case "current": {
                if (!dispatcher || !dispatcher.queue.current) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`There is nothing playing.`),
                    ],
                });
                const song = dispatcher.queue.current;
                let data = await favouriteSchema.findOne({ userID: interaction.member.id });
                if (!data) {
                    data = new favouriteSchema({
                        userID: interaction.member.id,
                        songs: [],
                        private: false,
                        createdAt: Date.now(),
                        lastUpdatedAt: Date.now(),
                    });
                }
                if (data.songs.length >= 200) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color.red)
                            .setDescription(`You can only have 200 songs in your playlist.`),
                    ],
                });
                if (data.songs.some(s => s.title === song.title)) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`This song is already in your playlist.`),
                    ],
                });
                data.songs.push({
            track: song.track,
            title: song.title,
            url: song.uri,
            duration: song.duration,
            author: song.author,
        });
                data.userID = interaction.member.id;
                data.private = data.private;
                data.lastUpdatedAt = Date.now();
                await data.save();

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription(`Added **${song.title}** to your playlist.`)
                    ],
                });
            }
            case "queue": {
                if (!dispatcher || !dispatcher.queue.current || dispatcher.queue.length <= 0) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`There is nothing playing.`),
                    ],
                });
                const queue = dispatcher.queue;
                let data = await favouriteSchema.findOne({ userID: interaction.member.id });
                if (!data) {
                    data = new favouriteSchema({
                        userID: interaction.member.id,
                        songs: [],
                        private: false,
                        createdAt: Date.now(),
                        lastUpdatedAt: Date.now(),
                    });
                }
                if (data.songs.length >= 200) return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`You can only have 200 songs in your playlist.`),
                    ],
                });
                if (queue.some(song => song.isStream)) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Cannot save the songs in your playlist. Please try again after removing the live stream from the queue.`),
        ],
      });
    }
                queue.forEach(song => {
                    if (data.songs.some(s => s.title === song.title)) return interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(client.color.red)
                                .setDescription(`This song is already in your playlist.`),
                        ],
                    });
                    data.songs.push({
            track: song.track,
            title: song.title,
            url: song.uri,
            duration: song.duration,
            author: song.author,
        });
                });
                data.userID = interaction.member.id;
                data.private = data.private;
                data.lastUpdatedAt = Date.now();
                await data.save();

                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription(`Added **${queue.length}** songs to your favourite list.`)
                    ],
                });
            }
            default: {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`Invalid subcommand. Please use \`queue\` or \`current\`.`),
                    ],
                });
            }
        }
    }
}