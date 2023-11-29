const fs = require("fs/promises");
const rawData = require("./rss.json");
const { getClient } = require("./getClient");

const client = getClient();

client
  .collections("test")
  .documents()
  .import(rawData.map((x) => ({ website: x.website, updated: x.updated })))
  .then(console.log);
