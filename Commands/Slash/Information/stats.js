const { CommandInteraction , MessageEmbed , version} = require("discord.js");
const JUGNU = require("../../../handlers/Client");
const { Queue } = require("distube");
let os = require("os");
let cpuStat = require("cpu-stat");

module.exports = {
  name: "stats",
  description: `see stats of bot`,
  userPermissions: [""],
  botPermissions: ["EMBED_LINKS"],
  category: "Information",
  cooldown: 5,
  type: "CHAT_INPUT",
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {JUGNU} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    cpuStat.usagePercent(function (err, percent, seconds) {
        interaction.editReply({
          embeds: [
            new MessageEmbed()
              .setColor(client.config.embed.color)
              .setAuthor({
                name: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTitle("__**Stats:**__")
            .addField(
              "⏳ Memory Usage",
              `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
                2
              )}\` / \`${(os.totalmem() / 1024 / 1024).toFixed(2)} MB\``
            )
            .addField(
              ":clock3: Uptime ",
              `<t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`
            )
            .addField("<:users:1010932215795953764>  Users", `\`${client.guilds.cache.reduce((acc,guild) => acc + guild.memberCount, 0)} \``, true)
            .addField("<:servers:1010920890751524967> Servers", `\`${client.guilds.cache.size}\``, true)
            .addField("📁 Channels", `\`${client.channels.cache.size}\``, true)
            .addField("<a:Discord:943402444061302824> Discord.js", `\`v${version}\``, true)
            .addField("<a:nodejs:1010930627849244692> Node Version", `\`${process.version}\``, true)
            .addField("<:ping:1010908148116242483>  Ping", `\`${client.ws.ping}ms\``, true)
              .addField(
                "🤖 CPU",
                `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``
              )
              .addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
              .addField("🤖 Arch", `\`${os.arch()}\``, true)
              // .addField("\u200b", `\u200b`)
              .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
              .setFooter(client.getFooter(interaction.user)),
          ],
        });
      });
  },
};
