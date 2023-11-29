const Typesense = require("typesense");
const { getClient } = require("./getClient");

// let client = new Typesense.Client({
//   nodes: [
//     {
//       host: "localhost", // For Typesense Cloud use xxx.a1.typesense.net
//       port: 8108, // For Typesense Cloud use 443
//       protocol: "http", // For Typesense Cloud use https
//     },
//   ],
//   apiKey: "xyz",
//   connectionTimeoutSeconds: 2,
// });
const client = getClient();

const schema = {
  name: "test",
  fields: [
    { name: "website", type: "string" },
    { name: "updated", type: "int32" },
  ],
  default_sorting_field: "updated",
  token_separators: [":", "/", "."],
};

client
  .collections()
  .create(schema)
  .then((data) => console.log(data));
