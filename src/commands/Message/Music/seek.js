const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "seek",
    description: "Seeks to the specified time in the current song",
    usage: "<time>",
    settings: {
        ownerOnly: false,
        inVoiceChannel: true,
        sameVoiceChannel: true,
        musicnotplaying: true,
        musicplaying: true,
    },
    /**
     * @param {{ client: import("../../structures/Client"), message:import("discord.js").Message }}
     */
    run: async ({ client, message , player}) => {
        if (!player.queue.current.isSeekable) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`This track isn't seekable.`),
                ],
            });
        }
        let time = message.args[0];
        if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(time)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
                            `You provided an invalid duration. Valid duration e.g. \`1:42\`.`
                        ),
                ],
            });
        }
        let ms = (() =>
            time
                .split(":")
                .map(Number)
                .reduce((a, b) => a * 60 + b, 0) * 1000)();
        if (ms > player.queue.current.duration) {
            return message.channel.send({
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
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(`Seeked to \`${time}\`.`),
            ],
        });
    },
};
