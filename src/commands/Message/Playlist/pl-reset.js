const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
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
    
    run: async ({ client, message }) => {
         
        const data = await favouriteSchema.findOne({ userID: message.author.id });
        if (!data) {
            data = new favouriteSchema({
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