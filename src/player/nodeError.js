module.exports = (client, node, error) => {
    client.logger.log(`Error while trying to connect "${node.options.identifier}" , Error: ${error.message}.` , "error");
    
  };