const { EmbedBuilder, WebhookClient } = require("discord.js");
const { inspect } = require('util')
new (require("./structures/Client"))().load();


process.removeAllListeners("warning");
process.on('unhandledRejection', (reason, p) => {
    console.log(reason, p);
});

process.on('uncaughtException', (err, origin) => {
    console.log(err, origin);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log(err, origin);
});
