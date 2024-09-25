const PlaylistSchema = require("../../../schema/Playlist");
const { EmbedBuilder } = require("discord.js");

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

    /**
    * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message }}
    */

    run: async ({ client, message, player }) => {
        let subcommand = message.args[0]?.toLowerCase();
        switch (subcommand) {
            case "current": {
                if (!player || !player.queue.current) return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`There is nothing playing.`),
                    ],
                });
                const song = player.queue.current;
                let data = await PlaylistSchema.findOne({ userID: message.author.id });
                if (!data) {
                    data = new PlaylistSchema({
                        userID: message.author.id,
                        songs: [],
                        private: false,
                        createdAt: Date.now(),
                        lastUpdatedAt: Date.now(),
                    });
                }
                if (data.songs.length >= 200) return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor(client.color.red)
                            .setDescription(`You can only have 200 songs in your playlist.`),
                    ],
                });
                if (data.songs.some(s => s.title === song.title)) return message.channel.send({
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
                data.userID = message.author.id;
                data.private = data.private;
                data.lastUpdatedAt = Date.now();
                await data.save();

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription(`Added **${song.title}** to your playlist.`)
                    ],
                });
            }
            case "queue": {
                if (!player || !player.queue.current || player.queue.length <= 0) return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`There is nothing in the queue.`),
                    ],
                });
                const queue = player.queue;
                let data = await PlaylistSchema.findOne({ userID: message.author.id });
                if (!data) {
                    data = new PlaylistSchema({
                        userID: message.author.id,
                        songs: [],
                        private: false,
                        createdAt: Date.now(),
                        lastUpdatedAt: Date.now(),
                    });
                }
                if (data.songs.length >= 200) return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`You can only have 200 songs in your playlist.`),
                    ],
                });
                if (queue.some(song => song.isStream)) {
                    return message.channel.send({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`Cannot save the songs in your playlist. Please try again after removing the live stream from the queue.`),
                        ],
                    });
                }
                queue.forEach(song => {
                    if (data.songs.some(s => s.title === song.title)) return message.channel.send({
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
                data.userID = message.author.id;
                data.private = data.private;
                data.lastUpdatedAt = Date.now();
                await data.save();

                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blue")
                            .setDescription(`Added **${queue.length}** songs to your playlist.`)
                    ],
                });
            }
            default: {
                return message.channel.send({
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