import { Client, Connection } from '@temporalio/client';

let temporalClient: Client;

export async function getTemporalClient() {
  if (temporalClient) return temporalClient;

  const connection = await Connection.connect({
    address: '100.99.14.109:7233'
  });

  temporalClient = new Client({
    connection
  });

  return temporalClient;
}
