const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "previous",
  aliases: ["prev", "back"],
  permission: "",
  description: "Plays the previous song",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction}}
   */
  run: async (client, interaction, player)  => {
    if (!player.queue.previous) {
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`There is no previous song.`),
        ],
      });
    }
    player.queue.unshift(player.queue.previous);
    player.stop();
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Started playing the previous song.`),
      ],
    });
  },
};
