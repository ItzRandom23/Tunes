const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: 'loop',
    description: 'Toggle looping of the current song.',
    settings: {
      ownerOnly: false,
      inVoiceChannel: true,
      sameVoiceChannel: true,
      musicnotplaying: true,
      musicplaying: true,
    },
    options: [
      {
        name: 'mode',
        type: 3, // STRING type
        description: 'Enable or disable loop mode',
        required: true,
        choices: [
          { name: 'Enable', value: 'enable' },
          { name: 'Disable', value: 'disable' }
        ]
      }
    ]
  },
  /**
   * @param {{ client: import("../../../structures/Client"), interaction: import("discord.js").Interaction }}
   */
  run: async ({ client, interaction, player }) => {
    const mode = interaction.options.getString('mode');

    if (mode === 'enable') {
      player.setTrackRepeat(true);
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("Song is now on loop.");
      return interaction.reply({ embeds: [embed] });
    }

    if (mode === 'disable') {
      player.setTrackRepeat(false);
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setDescription("Song is no longer on loop.");
      return interaction.reply({ embeds: [embed] });
    }

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setDescription("Invalid mode specified. Use `enable` or `disable`.");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
