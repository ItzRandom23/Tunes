const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "volume",
  description: "Increase or decrease the songs volume",
  usage: "[volume]",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  options: [
    {
      name: "volume",
      description: "Enter the volume amount to set",
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction, player) => {
    if (!interaction.options.getInteger("volume")) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`The current volume is **${player.volume}%**`),
        ],
      });
    }

    let volume = interaction.options.getInteger("volume");
    if (isNaN(volume) || volume < 0 || volume > 100) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Enter a volume amount between \`0 - 100\`.`),
        ],
      });
    }
    if (player.volume === volume) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Volume is already set to **${volume}%**`),
        ],
      });
    }
    player.setVolume(volume);

    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `Successfully changed the **volume** to **${player.volume}%**`
          ),
      ],
    });
  },
};
