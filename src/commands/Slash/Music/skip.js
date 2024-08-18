const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "skip",
    description: "Skips the current song or the provided number of songs",
    settings: {
        ownerOnly: false,
        inVoiceChannel: true,
        sameVoiceChannel: true,
        musicnotplaying: true,
        musicplaying: true,
    },
    options: [
        {
            name: "position",
            description: "Enter the position to where you want to skip to",
            type: ApplicationCommandOptionType.Integer,
            required: false,
        },
    ],
    /**
     * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction}}
     */
    run: async (client, interaction, player)  => {
        if (!player.queue.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`There is no other song in the queue.`),
                ],
            });
        }

        let skipTo = interaction.options.getInteger("position");

        if (!skipTo) {
            player.stop();
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(`Successfully **skipped** the current song.`),
                ],
            });
        }

        if (isNaN(skipTo) || skipTo <= 0 || skipTo > player.queue.length) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Enter a number between 1 and the total number of songs queued.`),
                ],
            });
        }

        player.stop(skipTo);
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Successfully **skipped** to the position you mentioned.`),
            ],
        });
    },
};
