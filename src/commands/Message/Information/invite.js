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
  run: async ({ client, message }) => {
    return await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor("Blue")
          .setDescription(
            `• [Invite **${client.user.username}** to your server](https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=12888394808&scope=bot%20identify%20applications.commands) \n` +
              `• [Join the support server](https://discord.gg/cool-music-support-925619107460698202)`
          ),
      ],
    });
  },
};
