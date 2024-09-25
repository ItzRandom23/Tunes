const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
module.exports = {
    name: "pl-state",
    permission: "",
    description: "Toggles your playlist to public or private",
    usage: "",
   settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },

    
    run: async ({ client, message }) => {
         
        let state = message.args[0].toLowerCase();
        if (!state) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Please provide a state.`),
            ],
        });
        if (state !== 'private' && state !== 'public') return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor(client.color.red)
                    .setDescription(`Invalid state.`),
            ],
        });
        if (state === 'private' || state === 'Private') state = true;
        if (state === 'public' || state === 'Public') state = false;
        let data = await favouriteSchema.findOne({ userID: message.author.id });
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

        if (data.private === state) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`Your playlist is already **${state ? "private" : "public"}**.`),
            ],
        });

        data.private = state;
        await data.save();
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Your playlist is now ${state ? "private" : "public"}.`),
            ],
        });
    }
}