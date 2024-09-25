const PlaylistSchema = require("../../../schema/Playlist");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pl-remove",
    aliases: ["fr"],
    permission: "",
    description: "Remove a song from your playlist",
    usage: "<song position>",
    settings: {
        ownerOnly: false,
        inVoiceChannel: false,
        sameVoiceChannel: false,
        musicnotplaying: false,
        musicplaying: false,
    },

    /**
    * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message }}
    */


    run: async ({ client, message }) => {

        const position = message.args[0];
        if (!position) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Please provide a song position.`),
            ],
        });
        let data = await PlaylistSchema.findOne({ userID: message.author.id });
        if (!data) {
            data = new PlaylistSchema({
                userID: message.author.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            })
        }
        await data.save();
        if (!data.songs.length) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        if (isNaN(position) || position <= 0 || position > data.songs.length) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Please provide a valid song position.`),
                ],
            });
        }
        data.songs.splice(position - 1, 1);
        await data.save();
        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Successfully removed the song from your playlist.`),
            ],
        });
    }
}