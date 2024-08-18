module.exports = {
  token:
    "", // Your Bot Token 
  mongo:
    "", // Your Mongo URL here
  prefix: "", // prefix here
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
