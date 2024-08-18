const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { prefix: defaultPrefix } = require("../../../config");

module.exports = {
  name: "prefix",
  aliases: [],
  permission: "ManageGuild",
  description: "Set or reset your server's prefix.",
  usage: "<set/reset>",
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
  run: async ({ client, message, guildData }) => {
    switch (message.args[0]?.toLowerCase()) {
      case "set": {
        let prefix = message.args.slice(1).join(" ");
        if (!prefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`Please specify the new prefix.`),
            ],
          });
        }
        if (prefix.length > 5) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The prefix cannot exceed **5** characters.`),
            ],
          });
        }
        if (guildData.prefix === prefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The prefix is already set to \`${prefix}\`.`),
            ],
          });
        }
        guildData.prefix = prefix;
        await guildData.save();
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Prefix successfully updated to \`${prefix}\`.`),
          ],
        });
      }
      case "reset": {
        if (guildData.prefix === defaultPrefix) {
          return message.channel.send({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(
                  `The prefix is already set to the default value.`
                ),
            ],
          });
        }
        guildData.prefix = defaultPrefix;
        await guildData.save();
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(
                `Prefix successfully reset to \`${defaultPrefix}\`.`
              ),
          ],
        });
      }
      default: {
        return message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Invalid option. Please use \`set\` or \`reset\`.`
              ),
          ],
        });
      }
    }
  },
};
