import {
  EventStoreDBClient,
  FORWARDS,
  ReadStreamOptions,
  START,
} from '@eventstore/db-client';
import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const ESDB = 'esdb';
const eventStoreFactory: FactoryProvider = {
  provide: ESDB,
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
export type Event<
  EventType extends string = string,
  EventData extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
  type: Readonly<EventType>;
  data: Readonly<EventData>;
}>;

export type Command<
  CommandType extends string = string,
  CommandData extends Record<string, unknown> = Record<string, unknown>,
> = Readonly<{
  type: Readonly<CommandType>;
  data: Readonly<CommandData>;
}>;

export type Decider<State, Command, EventType extends Event> = {
  decide: (command: Command, state: State) => EventType | EventType[];
  evolve: (currentState: State, event: EventType) => State;
  getInitialState: () => State;
};

export const readStream = async <EventType extends Event>(
  eventStore: EventStoreDBClient,
  streamId: string,
  streamOptions?: ReadStreamOptions,
) => {
  const events = [];
  for await (const { event } of eventStore.readStream<EventType>(
    streamId,
    streamOptions,
  )) {
    console.log('idk man', event);
    if (!event) continue;

    events.push(<EventType>{
      type: event.type,
      data: event.data,
    });
  }
  return events;
};
export { eventStoreFactory };
