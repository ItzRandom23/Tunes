const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  description: "Get the bot's uptime.",
  usage: "<prefix>uptime",
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
    let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        let hours = Math.floor(totalSeconds / 3600) % 24;
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        const embed = new EmbedBuilder()
            .setTitle("Tune's Uptime")
            .setDescription(`**Uptime**: ${days} Day(s), ${hours} Hour(s), ${minutes} Minute(s), ${seconds} Second(s)`)
            .setColor("#000000")
            .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .setTimestamp();

        try {
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send uptime:', error);
            return message.reply('Failed to send uptime information.');
        }
  }
}
