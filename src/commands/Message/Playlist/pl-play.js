const PlaylistSchema = require("../../../schema/Playlist");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "pl-play",
    permission: "",
    description: "Play your playlist",
    usage: "fav-play [position] [user]",
    settings: {
    ownerOnly: false,
    inVoiceChannel: true,
    sameVoiceChannel: true,
    musicnotplaying: false,
    musicplaying: false,
  },
    
   /**
   * @param {{ client: import("../../structures/Client"), message: import("discord.js").Message }}
   */

    run: async ({ client, message, player, guildData }) => {
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
        let data = await PlaylistSchema.findOne({ userID: user });
        if (!data) {
            data = new PlaylistSchema({
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
        if (!player) {
      player = client.manager.create({
        guild: message.guildId,
        textChannel: message.channelId,
        voiceChannel: message.member?.voice.channelId,
        selfDeafen: true,
        volume: 100,
      });
      if (player.state !== "CONNECTED") player.connect();
    }

    const tracks = [];
    for (let i = 0; i < data.songs.length; i++) {
      const searchResult = await player.search(data.songs[i].url, message.author);
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

    if (!player.queue.current) {
      player.queue.add(tracks);
      a = 1
      player.play();
    } else {
      a = 0
      player.queue.add(tracks);
    }

        return await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blue")
                    .setDescription(`Added ${tracks.length + a} songs to the queue.`),
            ],
        })
    }
}