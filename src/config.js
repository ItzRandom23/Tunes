module.exports = {
  token:
    "", // Your Bot Token 
  mongo:
    "", // Your Mongo URL here
  prefix: "", // prefix here
  support: "" //support server link
  defaultsource: "", // your source here ( youtube , spotify , deezer , tidal , applemusic , jiosaavn , bandcamp etc ) THE SOURCE MUST BE ENABLED IN YOUR LAVALINK SERVER!
  nodes: [
    {
      identifier: "", // Name of the Node
      host: "", // I.P Address of the Node
      port: 443, // Port of the Node
      password: "", // Password of the Node
      retryAmount: 1000,
      retrydelay: 10000,
      resumeStatus: false,
      resumeTimeout: 1000,
      secure: false, // true or false
    },  
    /*  EXAMPLE LAVALINK 
    {
      identifier: "Node1", // Name of the Node
      host: "node.lewdhutao.my.eu.org", // I.P Address of the Node
      port: 13592, // Port of the Node
      password: "youshallnotpass", // Password of the Node
      retryAmount: 1000,
      retrydelay: 10000,
      resumeStatus: false,
      resumeTimeout: 1000,
      secure: false, // true or false
    },*/
  ],
  ownerID: ["", ""],
  spotify: [
    {
      Id: "",
      Secret: "",
    },
    {
      Id: "",
      Secret: "",
    },
  ],
};