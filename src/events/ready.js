const {
  REST,
  Routes,
  ApplicationCommandType,
  ActivityType,
} = require("discord.js");

/**
 * @param {import("../structures/Client")} client
 */

module.exports = async (client) => {
  client.logger.log(`launched cluster #${client.cluster.id}.`, "ready");
  client.manager.init(client.user.id);
  client.user.setActivity({
    name: `Tunes in HD`,
    type: ActivityType.Playing,
  });
  if (client.cluster.id === 0) {
    const rest = new REST({ version: "10" }).setToken(client.token);
    let appCommand = [];
    client.slashCommands
      .filter(({ category }) => category !== "Owner")
      .map(({ description, name, options }) => {
        appCommand.push({
          name,
          description,
          options,
          type: ApplicationCommandType.ChatInput,
          dmPermission: false,
        });
      });
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: appCommand,
    });
  }
};
