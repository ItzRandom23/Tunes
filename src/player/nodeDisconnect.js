module.exports = (client, node, reason) => {
    client.logger.log(`Node "${node.options.identifier}" Disconnected , Reason: ${JSON.stringify(reason)}.` , "warn");
  };