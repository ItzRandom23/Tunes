const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ping",
  aliases: ["latency"],
  permission: "",
  description: "Shows the bot's latency",
  usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    return await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(`API Latency - \`${Math.trunc(client.ws.ping)}\` ms`),
      ],
    });
  },
};
