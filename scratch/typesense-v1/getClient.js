const Typesense = require("typesense");

function getClient() {
  return new Typesense.Client({
    nodes: [
      {
        host: "localhost", // For Typesense Cloud use xxx.a1.typesense.net
        port: 8108, // For Typesense Cloud use 443
        protocol: "http", // For Typesense Cloud use https
      },
    ],
    apiKey: "xyz",
    connectionTimeoutSeconds: 2,
  });
}

module.exports = {
  getClient,
};
