import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { FactoryProvider } from '@nestjs/common';

const client = EventStoreDBClient.connectionString`esdb://tracker.climb.rest:2113?tls=false`;

const connect = async () => {
  await client.readAll({
    direction: FORWARDS,
    fromPosition: START,
    maxCount: 1,
  });
};

const eventStoreFactory: FactoryProvider = {
  provide: 'esdb',
  useFactory: () => client,
};

// Don't expose the raw client to force the client to use DI 😛
export { connect, eventStoreFactory };
