const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",
  description: "Get the uptime of the bot",
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
    /**
     * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
     */
    run: async (client, interaction) => {
        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(
                        `Last Restarted <t:${Math.floor((Date.now() - client.uptime) / 1000)}:R>`
                      ),
            ],
        });
    },
};
