const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
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
    options: [
        {
            name: "song-position",
            description: "The position of the song in your playlist",
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },
    ],
    
    run: async (client, interaction, player) => {
         
        const position = interaction.options.getInteger("song-position");
        if (!position) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Please provide a song position.`),
            ],
        });
        let data = await favouriteSchema.findOne({ userID: interaction.member.id });
        if (!data) {
            data = new favouriteSchema({
                userID: interaction.member.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            })
        }
        await data.save();
        if (!data.songs.length) return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        if (isNaN(position) || position <= 0 || position > data.songs.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Please provide a valid song position.`),
                ],
            });
        }
        data.songs.splice(position - 1, 1);
        await data.save();
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Successfully removed the song from your playlist.`),
            ],
        });
    }
}