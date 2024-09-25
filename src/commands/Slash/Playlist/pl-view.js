const favouriteSchema = require("../../../schema/Playlist");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");


module.exports = {
    name: "pl-view",
    permission: "",
    description: "View your playlist",
    usage: "<song's name>",
    settings: {
    ownerOnly: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
    musicnotplaying: false,
    musicplaying: false,
  },
    options: [
        {
            name: "user",
            description: "The user to view their favourite list",
            type: ApplicationCommandOptionType.User,
        },
    ],
    
    run: async (client, interaction, player) => {
         
        let user = interaction.options.getUser("user");
        if (!user) user = interaction.member.user;
        if (/^[0-9]+$/.test(user) || (/<@!?(\d+)>/g.test(user) && !['@everyone', '@here'].includes(user))) {
            try {
                user = await client.users.fetch(user);
            } catch (error) {
                return interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(`You haven't provided a valid user.`)
                    ]
                });
            }
            const data = await favouriteSchema.findOne({ userID: user.id });
            if (!data) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`This user doesn't have any songs in the playlist.`),
                ],
            });
            if (data.private && user.id !== interaction.member.user.id) return console.log(1), interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`${user.username}'s playlist list is **private**.`),
                ],
            });
            if (!data.songs.length) return interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(`This user doesn't have any songs in the playlist.`),
                ],
            });
            for (let i = 0; i < data.songs.length; i++) {
                if (data.songs.length < 10) {
                    const embed = new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({
                            name: `${user.displayName}'s playlist`,
                            url: client.config.support,
                            iconURL: client.user.avatarURL(),
                        })
                        .setDescription(data.songs.map(({ duration, title, url }, index) => `\`${i + ++index}.\` [${title.length > 64 ? `${title.slice(0, 64)}...` : title}](${url}) - \`${client.util.duration(duration)}\``).join("\n"))
                        .setFooter({ text: `Total songs: ${data.songs.length} | Private: ${data.private}` });
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            let list = [];
            for (let i = 0; i < data.songs.length; i += 10) {
                let songs = data.songs.slice(i, i + 10);
                list.push(
                    songs.map(({ duration, title, url }, index) => `\`${i + ++index}.\` [${title.length > 64 ? `${title.slice(0, 64)}...` : title}](${url}) - \`${client.util.duration(duration)}\``).join("\n")
                );
            }
            let embeds = [];
            let page = 1;
            for (let i = 0; i < list.length; i++) {
                embeds.push(
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setAuthor({
                            name: `${user.displayName}'s playlist (${data.songs.length})`,
                            url: client.config.support,
                            iconURL: client.user.avatarURL(),
                        })
                        .setDescription(list[i])
                        .setFooter({ text: `Page ${page++} of ${list.length} | Private: ${data.private}` })
                );
            }
            client.util.paginate(context, embeds);
        } else {
            return interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Invalid User').setDescription(`Please provide a valid user.`).setColor("Blue")] });
        }
    }
};