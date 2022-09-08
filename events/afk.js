const { afk } = require('../Collection')
const client = require('../index')
const moment = require('moment')

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return
  const mentionedMember = message.mentions.members.first()
  if (mentionedMember) {
    const data = afk.get(mentionedMember.id)

    if (data) {
      const [ timestamp, reason ] = data
      const timeAgo = moment(timestamp).fromNow()
      message.reply({ content: `${mentionedMember} is currently AFK for: ${reason}`})
    }
  }
  const gData = afk.get(message.author.id)
  if(gData) {
    afk.delete(message.author.id)
    message.reply({ content: `Your AFK has been removed!`})
  }
})