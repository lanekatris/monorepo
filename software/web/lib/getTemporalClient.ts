import { Client, Connection } from '@temporalio/client';

let temporalClient: Client;

export async function getTemporalClient() {
  if (temporalClient) return temporalClient;

  const connection = await Connection.connect({
    address: '192.168.86.100:7233'
  });

  temporalClient = new Client({
    connection
  });

  return temporalClient;
}
