const { EmbedBuilder, InteractionCollector } = require("discord.js");

module.exports = {
    name: "help",
    description: "Get the bot's help menu.",
    usage: "",
  settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").CommandInteraction }}
   */
  run: async (client, interaction) => {
        const embed = new EmbedBuilder()
            .setTitle(` ${client.user.displayName} Help Menu`)
            .setThumbnail(client.user.displayAvatarURL())
            .setColor("Blue")
            .setDescription(
                "Bringing you high-quality music and endless entertainment with our diverse range of free, easy-to-use commands."
            );

        const configCommands = interaction.client.commands
            .filter((command) => command.category === "Config")
            .map((command) => `\`${command.name}\``);
        embed.addFields({
            name: "Config Commands",
            value: `${configCommands.join(", ")}`,
        });

        const musicCommands = interaction.client.commands
            .filter((command) => command.category === "Music")
            .map((command) => `\`${command.name}\``);
        embed.addFields({
            name: "Music Commands",
            value: `${musicCommands.join(", ")}`,
        });

        const infoCommands = interaction.client.commands
            .filter((command) => command.category === "Information")
            .map((command) => `\`${command.name}\``);
        embed.addFields({
            name: "Information Commands",
            value: `${infoCommands.join(", ")}`,
        });

        const playlistCommands = interaction.client.commands
            .filter((command) => command.category === "Playlist")
            .map((command) => `\`${command.name}\``);
        embed.addFields({
            name: "Playlist Commands",
            value: `${playlistCommands.join(", ")}`,
        });



        interaction.editReply({ embeds: [embed] });
    },
};
