import { Inject, UseGuards } from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import {
  EventMessageUpdated,
  EventTagCreated,
  EventTagRemoved,
  FeedEvent,
} from './queries/get-feed-v2.handler';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { EventDeleted } from './events/event-deleted';
import { nanoid } from 'nanoid';
import { format } from 'date-fns';
import { Esdb, ESDB } from './utils/constants';
import { EventNames } from '../dg/types/disc-added';

@InputType()
export class EventEditMessageInput {
  @Field()
  eventId: string;
  @Field()
  message: string;
}

@InputType()
export class EventAddTagInput {
  @Field()
  eventId: string;
  @Field()
  tag: string;
}

@InputType()
export class EventRemoveTagInput {
  @Field()
  eventId: string;
  @Field()
  tagId: string;
}

@Resolver(() => FeedEvent)
@UseGuards(GuardMe)
export class AppMutationResolver {
  constructor(@Inject(ESDB) private esdb: EventStoreDBClient) {}

  @Mutation(() => Boolean)
  async eventRemove(@Args('eventId') eventId: string): Promise<boolean> {
    const event = jsonEvent<EventDeleted>({
      type: 'event-deleted',
      data: {
        id: nanoid(),
        date: format(new Date(), 'yyyy-LL-dd'),
        eventId,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);

    return true;
  }

  @Mutation(() => Boolean)
  async eventEditMessage(
    @Args('input') input: EventEditMessageInput,
  ): Promise<boolean> {
    const { eventId, message } = input;

    const event = jsonEvent<EventMessageUpdated>({
      type: EventNames.EventMessageUpdated,
      data: {
        id: nanoid(),
        eventId,
        message,
        date: format(new Date(), 'yyyy-LL-dd'),
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
    return true;
  }

  @Mutation(() => Boolean)
  async eventAddTag(@Args('input') input: EventAddTagInput): Promise<boolean> {
    const { eventId, tag } = input;
    console.log(input);

    const event = jsonEvent<EventTagCreated>({
      type: EventNames.EventTagCreated,
      data: {
        id: nanoid(),
        eventId,
        date: format(new Date(), 'yyyy-LL-dd'),
        tag,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
    return true;
  }

  @Mutation(() => Boolean)
  async eventRemoveTag(
    @Args('input') input: EventRemoveTagInput,
  ): Promise<boolean> {
    const { eventId, tagId } = input;
    const event = jsonEvent<EventTagRemoved>({
      type: EventNames.EventTagRemoved,
      data: {
        id: nanoid(),
        eventId,
        date: format(new Date(), 'yyyy-LL-dd'),
        tagId,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
    return true;
  }
}
