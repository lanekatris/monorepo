const { getClient } = require("./getClient");
const client = getClient();

const searchParameters = {
  q: "sa",
  query_by: "website",
  sort_by: "updated:desc",
  // prefix: false,
  // infix: "always",
};

client
  .collections("test")
  .documents()
  .search(searchParameters)
  .then((x) => console.log(x.hits.map((y) => y.document)));
// .export()
// .then(console.log);
