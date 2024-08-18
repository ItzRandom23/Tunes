const { Schema, model } = require("mongoose");
const { prefix: defaultPrefix } = require("../config");

module.exports = model(
  "Guild",
  new Schema({
    id: { type: String },
    prefix: { type: String, default: defaultPrefix },
    alwaysinvc: {
      enabled: { type: Boolean, default: false },
      textChannel: { type: String, default: null },
      voiceChannel: { type: String, default: null },
    },
  })
);

