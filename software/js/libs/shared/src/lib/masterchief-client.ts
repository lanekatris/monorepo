import { GraphQLClient } from 'graphql-request';
import { getSdk } from './masterchief-sdk';

const client = new GraphQLClient(
  process.env.MASTERCHIEF_URL || 'http://localhost:3333/graphql'
);
export const masterChiefClient = getSdk(client);
