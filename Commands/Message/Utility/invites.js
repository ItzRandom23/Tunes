const config = require(`../../../settings/config.js`);
const {
  Client,
  Message,
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: "invites",
  aliases: ["inv"],
  description: `reveals the codes of people`,
  userPermissions: [""],
  botPermissions: ["SEND_MESSAGES"],
  category: "Utility",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   * @param {Client} client 
   * @param {Message} message
   * @param {String[]} args
   */

   run: async (client, message, args) => {
    try {
      let user = message.mentions.users.first() || message.author
      let invites = await message.guild.invites.fetch();
      let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id)

      if (userInv.size <= 0) {
        return message.reply({embeds: [new MessageEmbed()
          .setColor("BLUE")
          .setDescription(`${user} don't have any invites`)]})
      }

      let invCodes = userInv.map(x => x.code).join('\n')
      let i = 0;
      userInv.forEach(inv => i += inv.uses)

      message.reply({embeds: [new MessageEmbed()
        .setTitle(`${user.username} Invites`)
        .setDescription(`__**User Invites**__\n**${i}**\n__**Invite Codes**__\n\`${invCodes}\``)
        // .addField('User Invites', i)
        // .addField('Invite Codes', invCodes)
        .setColor("BLUE")
        .setTimestamp()]})
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const errorLogsChannel = client.channels.cache.get("975257243723378698");
      return errorLogsChannel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setTitle(` Got a Error:`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
          .setFooter(`Having: ${message.guild.memberCount} Users`)
        ]
      })
    }
  }
}