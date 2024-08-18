const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "invite",
  aliases: ["inv"],
  description: "Get the bot's invite link.",
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
  run: async ({ client, message }) => {}}
