const { MessageActionRow, MessageEmbed, MessageButton, MessageSelectMenu } = require('discord.js')
const component = MessageActionRow
const embed = MessageEmbed
const button = MessageButton
const menu = MessageSelectMenu

module.exports = {
  name: 'embed',
  aliases: ['embed', 'createembed'],
  description: 'Create an embed',
    userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["SEND_MESSAGES"],
  category: "Utility",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  
  run: async (client, message, args, Discord) => {
    let channel = message.mentions.channels.first()
    if (!channel) return message.reply({ content: 'Please mention a channel to send the embed to'})

    let conf = false

    let but = new component().addComponents(
      new button()
      .setStyle('SUCCESS') // makes button green
      .setLabel('Create') // label on button
      .setEmoji('✔️')
      .setCustomId('embedc'),
      new button()
      .setStyle('DANGER') // red
      .setLabel('Cancel') 
      .setEmoji('❌')
      .setCustomId('embedd') // embed delete 
    )

    let result = new embed()
    .setColor('#2f3136')

    let opt = new component().addComponents(
      new menu()
      .setCustomId('embedder')
      .setPlaceholder('Select an option!')
      .addOptions([
        {
          label: 'Title',
          description: 'Set a title for your embed',
          value: 'etitle'
        },
        {
          label: 'Description',
          description: 'Set a description for your embed',
          value: 'edesc'
        },
        {
          label: 'Color',
          description: 'Set a color for your embed',
          value: 'ecolor'
        },
        {
          label: 'Thumbnail',
          description: 'Set a thumbnail for your embed',
          value: 'ethumb'
        }
      ])
    )

    let filter1 = (i) => i.user.id === message.author.id
    let filter2 = (m) => m.author.id === message.author.id

    let cr = new embed()
    .setTitle('Embed Creation!')
    .setDescription('Select an option to set the value for your new embed')
    .setColor('GREEN')

    let pre = new embed() // preview
    .setColor('#2f3136')
    .setDescription('Preview will show here')

    let msg = await message.channel.send({ embeds: [cr], components: [opt] })

    let preview = await message.channel.send({ embeds: [pre], components: [but] })

    const colb = await preview.createMessageComponentCollector({ filter: filter1 })

    colb.on('collect', async (i) => {
      if (i.customId === 'embedc') {
        if (conf === false) return i.reply({ contnent: 'Plesae provide a description for your embed'})
        i.channel.send({ content: `Your embed was successfully sent in ${channel}`})
        msg.delete()
        preview.delete()
        channel.send({ embeds: [result] })
      }
      if (i.customId === 'embedd') {
        i.channel.send({ content: `Embed creation was canceled`})
        msg.delete()
        preview.delete()
      }
    })

    const col = await msg.createMessageComponentCollector({ filter: filter1, componentType: 'SELECT_MENU'})

    col.on('collect', async (i) => {
      if (i.values[0] === 'etitle') {
        i.reply({ content: '**Title** option was selected. Please enter your desired title for your embed'})
        let t1 = await message.channel.awaitMessages({ filter: filter2, max: 1})
        let title = t1.first().content
        pre.setTitle(title)
        result.setTitle(title)
        t1.first().delete()
        preview.edit({ content: '**Preview**', embeds: [pre] })
      }
      if (i.values[0] === 'edesc') {
        i.reply({ content: '**Description** option was selected. Please enter your desired description for your embed'})
        let d1 = await message.channel.awaitMessages({ filter: filter2, max: 1})
        let desc = d1.first().content
        conf = true
        pre.setDescription(desc)
        result.setDescription(desc)
        d1.first().delete()
        preview.edit({ content: '**Preview**', embeds: [pre] })
      }
      if (i.values[0] === 'ecolor') {
        i.reply({ content: '**Color** option was selected. Please enter your desired __HEX CODE__ for the color of your embed'})
        let c1 = await message.channel.awaitMessages({ filter: filter2, max: 1})
        let color = c1.first().content
        if (!color.startsWith('#')) return i.followUp({ content: 'Please start from the beginning of the color option and be sure you are sending a valid HEX CODE.'})
        pre.setColor(color)
        result.setColor(color)
        c1.first().delete()
        preview.edit({ content: '**Preview**', embeds: [pre] })
      }
      if (i.values[0] === 'ethumb') {
        i.reply({ content: '**Thumbnail** option was selected. Please enter your desired __URL__ for the thumbanil of your embed'})
        let th1 = await message.channel.awaitMessages({ filter: filter2, max: 1})
        let thumb = th1.first().content
        function is_url(str) {
          let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/

          if (regexp.test(str)) {
            return true
          } else {
            return false
          }

          // this will be in the description
        }

        if (is_url(thumb) === false) {
          th1.first().delete()
          return i.followUp({ content: '**Thumbnail** needs to be a link.'})
        }
        pre.setThumbnail(thumb)
        result.setThumbnail(thumb)
        th1.first().delete()
        preview.edit({ content: '**Preview**', embeds: [pre] })
      }
    })
  }
}