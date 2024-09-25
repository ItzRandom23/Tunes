const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const Premium = require("../../../schema/PremiumDB");
const Premiumcheck = require("../../../schema/Premium");
module.exports = {
    name: "pl-play",
    permission: "",
    description: "Play your favourite list",
    usage: "fav-play [position] [user]",
    settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
    
    run: async ({ client, message, dispatcher, guildData }) => {
        let position = message.args[0];
        const userRegex = /<@!?(\d{17,19})>/;
        if (userRegex.test(position)) {
            return await message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`Do you mean \`${guildData.prefix}fav-play all [user]\``),
                ],
            })
        }
        let user = message.args[1];
        if (user && user.includes("<@") && user.includes(">")) user = user.replace(/[<@!>]/g, "");
        if (!user) user = message.author.id;
        let data = await favouriteSchema.findOne({ userID: user });
        if (!data) {
            data = new favouriteSchema({
                userID: message.author.id,
                songs: [],
                private: false,
                createdAt: Date.now(),
                lastUpdatedAt: Date.now(),
            });
        }
        await data.save();
        if (data.private && data.userID !== message.author.id) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`This user's playlist is private.`),
            ],
        });
        if (!data.songs.length) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`You don't have any songs in the playlist.`),
            ],
        });
        if (!dispatcher) {
      dispatcher = client.manager.create({
        guild: message.guildId,
        textChannel: message.channelId,
        voiceChannel: message.member?.voice.channelId,
        selfDeafen: true,
        volume: 100,
      });
      if (dispatcher.state !== "CONNECTED") dispatcher.connect();
    }

    const tracks = [];
    for (let i = 0; i < data.songs.length; i++) {
      const searchResult = await dispatcher.search(data.songs[i].url, message.member.user);
      if (searchResult.tracks.length > 0) {
        tracks.push(searchResult.tracks[0]);
      } else {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor("Red")
              .setDescription(
                `Failed to find a track for URL: ${data.songs[i].url}. Skipping...`
              ),
          ],
        });
      }
    }

    if (!dispatcher.queue.current) {
      dispatcher.queue.add(tracks);
      dispatcher.play();
    } else {
      dispatcher.queue.add(tracks);
    }
        return await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Added ${position ? "the song" : "all songs"} to the queue.`),
            ],
        })
    }
}