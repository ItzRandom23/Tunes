const { readdirSync } = require("fs");
const { Manager } = require("magmastream");
const config = require("../config");

module.exports = class Magmastream extends Manager {
  constructor(client) {
    super({
      nodes: config.nodes,
      autoPlay: true,
      defaultSearchPlatform: "spotify",
      clientName: "Tunes",
      send: (id, payload) => this._sendPayload(id, payload),
    });

    this.client = client;
    this._loadMagmastreamEvents();
  }

  _sendPayload(id, payload) {
    const guild = this.client.guilds.cache.get(id);
    if (guild) return guild.shard.send(payload);
  }

  _loadMagmastreamEvents() {
    let i = 0;
    readdirSync("./src/player/").forEach((file) => {
      const event = require(`../player/${file}`);
      const eventName = file.split(".")[0];
      this.on(eventName, event.bind(null, this.client));
      ++i;
    });
    console.log(`Loaded a total of ${i} Magmastream event(s)`);
  }
};
