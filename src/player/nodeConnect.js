const db = require("../schema/Guild");

module.exports = async (client, node) => {
    client.logger.log(`Node "${node.options.identifier}" connected.`, "log");

  let i = 0;
  const maindata = await db.find();
  for (const data of maindata) {
    i++;
    const index = maindata.indexOf(data);
    setTimeout(async () => {
      const text = client.channels.cache.get(data.alwaysinvc.textChannel);
      const guild = client.guilds.cache.get(data.id);
      const voice = client.channels.cache.get(
        data.alwaysinvc.voiceChannel
      );
      if (!guild || !text || !voice) return;

      a = client.manager.create({
        guild: guild.id,
        textChannel: text?.id,
        voiceChannel: voice.id,
        selfDeafen: true,
        volume: 100,
      });
      if (a.state !== "CONNECTED") {
        a.connect();
      }
    }),
      index * 20000;
  }
};
