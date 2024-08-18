const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "seek",
    description: "Seeks to the specified time in the current song",
    options: [
        {
            name: "time",
            description:
                "Enter the timestamp where you want to seek the track to. Ex - 1:42",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
    ],
    settings: {
        ownerOnly: false,
        inVoiceChannel: true,
        sameVoiceChannel: true,
        musicnotplaying: true,
        musicplaying: true,
    },
    /**
     * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
     */
    run: async (client, interaction, player) => {
        if (!player.queue.current.isSeekable) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`This track isn't seekable.`),
                ],
            });
        }

        let time = interaction.options.getString("time");
        if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(time)) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `You provided an invalid duration. Valid duration e.g. \`1:42\`.`
                        ),
                ],
            });
        }

        let ms = time
            .split(":")
            .map(Number)
            .reduce((a, b) => a * 60 + b, 0) * 1000;

        if (ms > player.queue.current.duration) {
            return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `The duration you provided exceeds the duration of the current track.`
                        ),
                ],
            });
        }

        player.seek(ms);
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`Seeked to \`${time}\`.`),
            ],
        });
    },
};
