import { GraphQLClient } from 'graphql-request';


const client = new GraphQLClient(
  process.env.MASTERCHIEF_URL || 'http://localhost:3333/graphql'
);
// export const masterChiefClient = getSdk(client);
