const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "volume",
  aliases: ["v", "vol"],
  permission: "",
  description: "Increase or decrease the songs volume",
  usage: "[volume]",
  settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: true,
    musicplaying: true,
  },
  /**
   * @param {{ message: import("discord.js").Message }}
   */
  run: async ({ message, player }) => {
    if (!message.args[0]) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`The current volume is **${player.volume}%**`),
        ],
      });
    }

    let volume = parseInt(message.args[0]);
    if (isNaN(volume) || volume < 0 || volume > 100) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Enter a volume amount between \`0 - 100\`.`),
        ],
      });
    }
    if (player.volume === volume) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Volume is already set to **${volume}%**`),
        ],
      });
    }
    player.setVolume(volume);

    return message.channel.send({
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
