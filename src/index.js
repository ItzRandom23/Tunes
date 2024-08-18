const { ClusterManager, ReClusterManager } = require("discord-hybrid-sharding");
const { token } = require("./config");
const manager = new ClusterManager("./src/bot.js", {
  token: token,
  totalShards: "auto",
  shardsPerClusters: 1,
  totalClusters: "auto",
  mode: 'process',
});

manager.extend(new ReClusterManager());
manager.on('clusterDestroy', (cluster) => console.log(`Destroyed shard ${cluster.id}`));
manager.spawn();
