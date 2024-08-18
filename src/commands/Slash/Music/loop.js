const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "loop",
  aliases: ["l", "repeat"],
  permission: "",
  description: "Loops the current song or queue",
  usage: "<song/queue>",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  options: [
    {
      name: "mode",
      description: "Choose to loop the current song or the queue.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: "song", value: "song" },
        { name: "queue", value: "queue" },
        { name: "off", value: "off" }
      ],
    },
  ],
  /**
   * @param {{ client: import("../../structures/Client"), interaction: import("discord.js").CommandInteraction}}
   */
  run: async ( client, interaction, player ) => {
    const mode = interaction.options.getString("mode");

    switch (mode) {
      case "song": {
        player.trackRepeat = !player.trackRepeat;
        const status = player.trackRepeat ? "enabled" : "disabled";
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Current song loop has been ${status}.`)
          ],
        });
      }
      case "queue": {
        player.queueRepeat = !player.queueRepeat;
        const status = player.queueRepeat ? "enabled" : "disabled";
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Queue loop has been ${status}.`)
          ],
        });
      }
      case "off": {
        player.trackRepeat = false;
        player.queueRepeat = false;
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Looping has been disabled.`)
          ],
        });
      }
      default: {
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(`Please use the command again and choose one of the following options: \`song\`, \`queue\`, or \`off\`.`)
          ],
        });
      }
    }
  },
};
