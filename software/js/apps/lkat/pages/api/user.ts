import {getSdk} from "../../graphql";
import {GraphQLClient} from "graphql-request";

const client = new GraphQLClient('http://localhost:3333/graphql')
const sdk = getSdk(client)

export default async function handler(req, res) {
  const idk = await sdk.places();

  res.status(200).json(idk);
}
