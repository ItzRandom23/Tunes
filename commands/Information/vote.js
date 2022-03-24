const { Command } = require("reconlx");
const ee = require("../../settings/embed.json");
const config = require("../../settings/config.json");
const { MessageEmbed } = require("discord.js");
const emoji = require('../../settings/emoji.json')

module.exports = new Command({
  // options
  name: "vote",
  description: `get link to vote the bot`,
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
        .setTitle(` :partying_face: Link to vote **Cool Music**`)
        .setDescription(`1. Click me to vote on [Top.gg](https://top.gg/bot/923529398425096193/vote)
2. Click me to vote on [discordbotlist](https://discordbotlist.com/bots/cool-music-5612/upvote)
Thanks for voting Cool Music`)
        .setFooter({text : ee.footertext , iconURL : ee.footericon})
    ]})
  },
});
