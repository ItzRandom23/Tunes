const { Client, Message, MessageEmbed } = require ('discord.js');

module.exports = {
  name: "top10",
  aliases: ["t10"],
  description: `reveals top 10 guilds of bot`,
  userPermissions: [""],
  botPermissions: ["SEND_MESSAGES"],
  category: "Utility",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,
  
 run: async(client, message, args) => {
  const guilds = client.guilds.cache
    .sort((a, b) => b.memberCount - a.memberCount)
    .first(10);
   const description = guilds
      .map((guild, index) => {
        return `${index + 1}) ${guild.name} => ${guild.memberCount} members`;
      })
       .join("\n" );

   message.channel.send(
     {
embeds:  [ new MessageEmbed().setTitle("My Top Servers").setDescription(description)]
     }
    );
  },
 };