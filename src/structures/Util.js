const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Collection,
  EmbedBuilder,
  Message,
} = require("discord.js");
class Util {
  /**
   *
   * @param {import('./Client')} client
   */
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {string} member
   */

  cooldown(member, command) {
    if (!this.client.cooldowns.has(command?.name)) {
      this.client.cooldowns.set(command?.name, new Collection());
    }
    const timestamps = this.client.cooldowns.get(command?.name);
    const cooldownAmount = 8000;
    if (timestamps.has(member)) {
      const expirationTime = timestamps.get(member) + cooldownAmount;
      if (Date.now() < expirationTime) {
        const timeLeft = (expirationTime - Date.now()) / 1000;
        return Math.trunc(timeLeft) + 1 === 1
          ? "a second"
          : `**${Math.trunc(timeLeft) + 1}** seconds`;
      } else {
        timestamps.set(member, Date.now());
        setTimeout(() => timestamps.delete(member), cooldownAmount);
      }
    } else {
      timestamps.set(member, Date.now());
      setTimeout(() => timestamps.delete(member), cooldownAmount);
    }
  }

  /**
   *
   * @param {number} ms
   */

  duration(ms, colon = true) {
    let s = Math.floor((ms / 1000) % 60);
    let m = Math.floor((ms / (1000 * 60)) % 60);
    let h = Math.floor((ms / (1000 * 60 * 60)) % 24);
    let d = Math.floor((ms / (1000 * 60 * 60 * 24)) % 365.25);
    return colon
      ? `${h !== 0 ? `${h}:` : ""}${m}:${s < 10 ? `0${s}` : s}`
      : `${
          d !== 0
            ? `${d} day${d !== 1 ? "s" : ""}`
            : h !== 0
            ? `${h} hour${h !== 1 ? "s" : ""}`
            : m !== 0
            ? `${m} minute${m !== 1 ? "s" : ""}`
            : s !== 0
            ? `${s} second${s !== 1 ? "s" : ""}`
            : ""
        }`;
  }

  /**
   *
   * @param {number} bytes
   */

  formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    return `${(
      bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
    ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
  }

  /**
   *
   * @param {import("discord.js").Interaction | import("discord.js").Message} context
   * @param {Array<EmbedBuilder>} embeds
   */

  async paginate(context, embeds) {
    let currentPage = 0;
    const message =
      context instanceof Message
        ? await context.channel.send({
            embeds: [embeds[currentPage]],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId("1")
                  .setEmoji({ name: "⏮️" })
                  .setDisabled(true),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("2")
                  .setEmoji({ name: "⏪" })
                  .setDisabled(true),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("3")
                  .setEmoji({ name: "⏩" }),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId("4")
                  .setEmoji({ name: "⏭️" })
              ),
            ],
          })
        : await context.followUp({
            embeds: [embeds[currentPage]],
            components: [
              new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId("1")
                  .setEmoji({ name: "⏮️" })
                  .setDisabled(true),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("2")
                  .setEmoji({ name: "⏪" })
                  .setDisabled(true),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Secondary)
                  .setCustomId("3")
                  .setEmoji({ name: "⏩" }),
                new ButtonBuilder()
                  .setStyle(ButtonStyle.Primary)
                  .setCustomId("4")
                  .setEmoji({ name: "⏭️" })
              ),
            ],
          });
    const collector = message.createMessageComponentCollector({
      time: 300000,
      filter: ({ member: { id: memberId } }) => memberId === context.member.id,
    });
    collector.on(
      "collect",
      /**
       *
       * @param {import('discord.js').ButtonInteraction} interaction
       * @returns
       */
      async (interaction) => {
        switch (interaction.customId) {
          case "1": {
            await interaction.deferUpdate();
            currentPage = 0;
            return message.edit({
              embeds: [embeds[currentPage]],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("1")
                    .setEmoji({ name: "⏮️" })
                    .setDisabled(true),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("2")
                    .setEmoji({ name: "⏪" })
                    .setDisabled(true),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("3")
                    .setEmoji({ name: "⏩" }),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("4")
                    .setEmoji({ name: "⏭️" })
                ),
              ],
            });
          }
          case "2": {
            await interaction.deferUpdate();
            --currentPage;
            return message.edit({
              embeds: [embeds[currentPage]],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("1")
                    .setEmoji({ name: "⏮️" })
                    .setDisabled(currentPage === 0),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("2")
                    .setEmoji({ name: "⏪" })
                    .setDisabled(currentPage === 0),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("3")
                    .setEmoji({ name: "⏩" })
                    .setDisabled(false),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("4")
                    .setEmoji({ name: "⏭️" })
                    .setDisabled(false)
                ),
              ],
            });
          }
          case "3": {
            await interaction.deferUpdate();
            currentPage++;
            return message.edit({
              embeds: [embeds[currentPage]],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("1")
                    .setEmoji({ name: "⏮️" })
                    .setDisabled(false),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("2")
                    .setEmoji({ name: "⏪" })
                    .setDisabled(false),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("3")
                    .setEmoji({ name: "⏩" })
                    .setDisabled(currentPage === embeds.length - 1),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("4")
                    .setEmoji({ name: "⏭️" })
                    .setDisabled(currentPage === embeds.length - 1)
                ),
              ],
            });
          }
          case "4": {
            await interaction.deferUpdate();
            currentPage = embeds.length - 1;
            return message.edit({
              embeds: [embeds[currentPage]],
              components: [
                new ActionRowBuilder().addComponents(
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("1")
                    .setEmoji({ name: "⏮️" }),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("2")
                    .setEmoji({ name: "⏪" }),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("3")
                    .setEmoji({ name: "⏩" })
                    .setDisabled(true),
                  new ButtonBuilder()
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId("4")
                    .setEmoji({ name: "⏭️" })
                    .setDisabled(true)
                ),
              ],
            });
          }
        }
      }
    );
    collector.on("end", () => {
      return message
        .edit({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("1")
                .setEmoji({ name: "⏮️" })
                .setDisabled(true),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("2")
                .setEmoji({ name: "⏪" })
                .setDisabled(true),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setCustomId("3")
                .setEmoji({ name: "⏩" })
                .setDisabled(true),
              new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setCustomId("4")
                .setEmoji({ name: "⏭️" })
                .setDisabled(true)
            ),
          ],
        })
        .catch(() => null);
    });
  }

  /**
   *
   * @param {import('discord.js').ButtonInteraction} int
   * @param {*} args
   * @param {*} color
   */
  async buttonReply(int, args, color) {
    await int.deferUpdate();
    if (!color) color = "#59D893";
    let m;
    if (int.replied) {
      m = await int.editReply({
        embeds: [new EmbedBuilder().setColor(color).setDescription(args)],
      });
    } else {
      m = await int.followUp({
        embeds: [new EmbedBuilder().setColor(color).setDescription(args)],
      });
    }
    setTimeout(async () => {
      if (int && !int.ephemeral) {
        if (m) await m?.delete();
      }
    }, 5000);
  }
}
module.exports = Util;
