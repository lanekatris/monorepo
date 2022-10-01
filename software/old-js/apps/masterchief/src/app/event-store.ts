import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ESDB } from './constants';

const eventStoreFactory: FactoryProvider = {
  provide: ESDB,
  useFactory: async (config: ConfigService) => {
    console.log('esdb connection', config.get('ESDB_CONN'));
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
