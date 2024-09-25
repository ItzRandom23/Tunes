const { model, Schema } = require("mongoose");

module.exports = model(
    "Playlist",
    new Schema({
        userID: { type: String, required: true },
        private: { type: Boolean, default: false },
        songs: { type: Array, default: [] },
        createdAt: { type: Date, default: Date.now },
        lastUpdatedAt: { type: Date, default: Date.now },
    })
);