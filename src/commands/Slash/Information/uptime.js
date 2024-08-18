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
    let totalSeconds = (client.uptime / 1000);
        let hours = Math.floor(totalSeconds / 3600);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        // let uptime = `**${hours}** hours, **${minutes}** minutes and **${seconds}** seconds`;
        let embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
            .setTitle("Tune's Uptime ")
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`**Uptime**: \` ${days} Day(s), ${hours} Hour(s), ${minutes} Minute(s), ${seconds} Second(s) \``)
            .setColor("#000000")
            .setFooter({ text: "Requested by " + interaction.user.tag })
            .setTimestamp()
            .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });

        return interaction.reply({ embeds: [embed] })
  }
}
