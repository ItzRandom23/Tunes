const PlaylistSchema = require("../../../schema/Playlist");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pl-reset",
    permission: "",
    description: "Resets your playlist",
    usage: "",
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
         
        const data = await PlaylistSchema.findOne({ userID: message.author.id });
        if (!data) {
            data = new PlaylistSchema({
                userID: message.author.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            });
        }
        await data.save();
        if (!data.songs.length) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        data.songs = [];
        await data.save();
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Cleared your playlist.`),
            ],
        });
    }
}