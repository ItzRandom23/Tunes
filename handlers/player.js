const Distube = require("distube").default;
const client = require("../index");
const { kookie } = require("../settings/config.json");
const filters = require("../settings/filters.json");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
let spotifyoptions = {
  parallel: true,
  emitEventsAfterFetching: true,
};

let player = new Distube(client, {
  customFilters: filters,
  emitAddListWhenCreatingQueue: true,
  emitAddSongWhenCreatingQueue: true,
  emitNewSongOnly: false,
  emptyCooldown: 2,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  nsfw: false,
  savePreviousSongs: true,
  searchCooldown: 0,
  searchSongs: 0,
  updateYouTubeDL: true,
  // youtubeCookie: `${kookie}`,
  youtubeDL: false,
  ytdlOptions: {
    highWaterMark: 1024 * 1024 * 64,
    quality: "highestaudio",
    format: "audioonly",
    liveBuffer: 60000,
    dlChunkSize: 1024 * 1024 * 64,
    filter: "audioonly",
  },
  plugins: [new SpotifyPlugin(spotifyoptions), new SoundCloudPlugin()],
});

module.exports = player;
