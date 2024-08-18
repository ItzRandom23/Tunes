const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "skip",
  aliases: ["s", "next"],
  description: "Skips the current song or the provided number of songs",
  usage: "[skip-to]",
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
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message}}
   */
  run: async ({ client, message, player }) => {
    
    if (!player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`There is no other song in the queue.`),
        ],
      });
    }
    let skipTo =  message.args[0];
    if (!skipTo) {
      player.stop();
       
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Blue")
            .setDescription(`Successfully **skipped** the current song.`),
        ],
      });
    }
    skipTo = parseInt(skipTo);
    if (isNaN(skipTo) || skipTo <= 0 || skipTo > player.queue.length) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription(`Enter the number between the total amount of songs queued.`),
        ],
      });
    }
    player.stop(skipTo);
     
    return message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`Successfully **skipped** to position you mentioned.`),
      ],
    });
  },
};
