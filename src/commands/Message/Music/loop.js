const { EmbedBuilder } = require("discord.js");

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
  /**
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message }}
   */
  run: async ({ client, message, player }) => {
    const mode = message.args[0]?.toLowerCase();

    switch (mode) {
      case "song": {
        player.trackRepeat = !player.trackRepeat;
        const status = player.trackRepeat ? "enabled" : "disabled";
        return message.channel.send({
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
        return message.channel.send({
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
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Looping has been disabled.`)
          ],
        });
      }
      default: {
        return message.channel.send({
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
