const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { prefix: defaultPrefix } = require("../../../config");

module.exports = {
  name: "prefix",
  description: "Configure or reset your server's prefix.",
  permission: "ManageGuild",
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
  options: [
    {
      name: "set",
      description: "Update the server's prefix.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "prefix",
          description: "Enter the new prefix.",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: "reset",
      description: "Revert to the default server prefix.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction, guildData: any }}
   */
  run: async (client, interaction, player, guildData) => {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case "set": {
        const prefix = interaction.options.getString("prefix");

        if (prefix.length > 5) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription("The prefix cannot exceed **5** characters."),
            ],
            ephemeral: true,
          });
        }

        if (guildData.prefix === prefix) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The prefix is already set to \`${prefix}\`.`),
            ],
            ephemeral: true,
          });
        }

        guildData.prefix = prefix;
        await guildData.save();

        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Blue")
              .setDescription(`Prefix successfully updated to \`${prefix}\`.`),
          ],
        });
      }

      case "reset": {
        if (guildData.prefix === defaultPrefix) {
          return interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor("Red")
                .setDescription(`The prefix is already at the default value.`),
            ],
            ephemeral: true,
          });
        }

        guildData.prefix = defaultPrefix;
        await guildData.save();

        return interaction.editReply({
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
        return interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Invalid subcommand. Please choose \`set\` or \`reset\`.`
              ),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
