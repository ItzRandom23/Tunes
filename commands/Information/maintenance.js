const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { MessageEmbed } = require("discord.js");
const emoji = require('../../settings/emoji.json')

module.exports = new Command({
  // options
  name: "maintenance",
  description: `get maintenance status of bot`,
  userPermissions: ['SEND_MESSAGES'],
  botPermissions: ['SEND_MESSAGES'],
  category: "Information",
  cooldown: 10,
  // command start
  run: async ({ client, interaction, args, prefix }) => {
    // Code
    interaction.followUp({embeds : [
        new MessageEmbed()
        .setColor(ee.color)
        .setTitle(` <a:Other:945323168405544980> Maintenance status of **Cool Music**`)
        .setDescription(`Upcoming maintenance scheduled
1. Major update of bot - ( Ended )`)
        .setFooter({text : ee.footertext , iconURL : ee.footericon})
    ]})
  },
});
