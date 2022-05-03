import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const eventStoreFactory: FactoryProvider = {
  provide: 'esdb',
  useFactory: async (config: ConfigService) => {
    const client = EventStoreDBClient.connectionString(config.get('ESDB_CONN'));
    await client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1,
    });

    return client;
  },
  inject: [ConfigService],
};

export { eventStoreFactory };
