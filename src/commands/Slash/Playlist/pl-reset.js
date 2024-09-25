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
    
    run: async (client, interaction) => {
         
        const data = await PlaylistSchema.findOne({ userID: interaction.member.id });
        if (!data) {
            data = new PlaylistSchema({
                userID: interaction.member.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            });
        }
        await data.save();
        if (!data.songs.length) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        data.songs = [];
        await data.save();
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Cleared your playlist.`),
            ],
        });
    }
}