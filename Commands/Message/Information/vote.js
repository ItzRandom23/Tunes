const { Message } = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "vote",
  aliases: ["vote"],
  description: `gets link to vote the bot `,
  userPermissions: [''],
  botPermissions: ['EMBED_LINKS'],
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    client.embed(message, `Vote :- https://discord.ly/cool-music-5612/upvote`);
  },
};
