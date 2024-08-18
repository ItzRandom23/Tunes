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
   * @param {{ client: import("../../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message }) => {
    return await message.channel.send({
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
