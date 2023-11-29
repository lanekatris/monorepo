const { getClient } = require("./getClient");

const client = getClient();

client.collections("test").delete().then(console.log);
