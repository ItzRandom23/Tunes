const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
  name: 'remind',
  aliases: ['reminder'],
  description: 'Set a reminder',
  userPermissions: [""],
  botPermissions: ["SEND_MESSAGES"],
  category: "Utility",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  
  run: async (client, message, args, Discord) => {
    let reminder = args.slice(1).join(' ')
    let time = args[0]

    if (!time) return message.reply({ content: 'Please specify a time!'})
    if (!reminder) return message.reply({ content: 'Please specify what your reminder is!'})
    if (reminder.length > 200) return message.reply({ content: 'You have reached the maximum amount of characters!'})

    const embed = new MessageEmbed()
    .setTitle('Reminder Set!')
    .setColor('GREEN')
    .setDescription(`Successfully set a reminder for <@${message.author.id}> a reminder!`)
    .addFields(
      {
        name: 'Reminded In:',
        value: `__${time}__`
      },
      {
        name: 'Reminder:',
        value: `__${reminder}__`
      }
    )
    .setTimestamp()

    message.channel.send({ embeds: [embed] })

    setTimeout(async function() {
      message.channel.send({ content: `<@${message.author.id}> timer done! Don't forget!`})

      const done = new MessageEmbed()
      .setColor('RED')
      .setTitle('Reminder!')
      .setDescription(`Don't forget!\n${reminder}`)
      .setTimestamp()

      message.channel.send({ embeds: [done] })
    }, ms (time))
  }
}