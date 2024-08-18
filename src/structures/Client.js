const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
} = require("discord.js");
const { readdirSync } = require("fs");
const mongoose = require("mongoose");
const { ClusterClient } = require("discord-hybrid-sharding");
const config = require("../config.js");
const logger = require("./logger.js");
const util = require("./Util.js");
const Magmastream = require("./Magmastream.js");

class Tunes extends Client {
  /**
   * @type ClusterClient
   */
  cluster;

  constructor() {
    super({
      allowedMentions: {
        parse: ["users", "roles", "everyone"],
        repliedUser: false,
      },
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
      shards: ClusterClient.getInfo().SHARD_LIST,
      shardCount: ClusterClient.getInfo().TOTAL_SHARDS,
    });

    this.cluster = new ClusterClient(this);
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.cooldowns = new Collection();
    this.events = new Collection();
    this.config = config;
    this.logger = logger;
    this.util = new util(this);
    this.owner = config.ownerID;
    this.manager = new Magmastream(this);
  }

  load() {
    let msgcmdcount = 0;
    readdirSync("./src/commands/Message").forEach((category) => {
      readdirSync(`./src/commands/Message/${category}`).forEach((command) => {
        msgcmdcount++;
        this.commands.set(command.split(".")[0], {
          ...require(`../commands/Message/${category}/${command}`),
          category,
        });
      });
    });
    let slashcmdcount = 0;
    readdirSync("./src/commands/Slash").forEach((category) => {
      readdirSync(`./src/commands/Slash/${category}`).forEach((command) => {
        slashcmdcount++;
        this.slashCommands.set(command.split(".")[0], {
          ...require(`../commands/Slash/${category}/${command}`),
          category,
        });
      });
    });
    let eventsCount = 0;
    readdirSync("./src/events").forEach((event) => {
      eventsCount++;
      this.events.set(event.split(".")[0], require(`../events/${event}`));
      this[`on${event === "ready.js" ? "ce" : ""}`](
        event.split(".")[0],
        (...args) => this.events.get(event.split(".")[0])(this, ...args)
      );
    });

    this.login(config.token);
    mongoose.connect(this.config.mongo, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    if (this.cluster.id === 0) {
      this.logger.log(`loaded ${msgcmdcount} message commands.`, "ready");
      this.logger.log(`loaded ${slashcmdcount} slash commands.`, "ready");
      this.logger.log(`loaded ${eventsCount} events.`, "ready");
    }
    this.once("ready", async () => {});
    return this;
  }
}

module.exports = Tunes;
