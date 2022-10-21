import { Inject, UseGuards } from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import {
  Article,
  ArticleEdited,
  ArticleEditedLink,
  EventMessageUpdated,
  EventTagCreated,
  EventTagRemoved,
  FeedEvent,
} from './queries/get-feed-v2.handler';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { EventDeleted } from './events/event-deleted';
import { nanoid } from 'nanoid';
import { Esdb, ESDB } from './utils/constants';
import { EventNames } from '../dg/types/disc-added';
import { generateDate } from './utils';
import { readStream } from './utils/event-store';

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

@InputType()
export class ArticleEditedInput implements Partial<Article> {
  @Field()
  body: string;
  @Field({ nullable: true })
  date?: string;
  @Field({ nullable: true })
  slug?: string;
  @Field({ nullable: true })
  title?: string;
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
        date: generateDate(),
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
        date: generateDate(),
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
        date: generateDate(),
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
        date: generateDate(),
        tagId,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event);
    return true;
  }

  @Mutation(() => Article)
  async articleCreate(
    @Args('input') input: ArticleEditedInput,
  ): Promise<Article> {
    console.log('input', input);

    const event = jsonEvent<ArticleEdited>({
      type: EventNames.ArticleEdited,
      data: {
        date: generateDate(),
        id: nanoid(),
        body: input.body,
      },
    });

    const streamName = `article-${event.data.id}`;
    await this.esdb.appendToStream(streamName, event);

    const event2 = jsonEvent<ArticleEditedLink>({
      type: EventNames.ArticleEditedLink,
      data: {
        id: nanoid(),
        date: generateDate(),
        articleId: event.data.id,
      },
    });
    await this.esdb.appendToStream(Esdb.StreamEvents, event2);
    // const events = await readStream(this.esdb, '$ce-article', {
    //   resolveLinkTos: true,
    // });
    // console.log(
    //   'events',
    //   events,
    //   events.map((x) => x.data.toString()),
    // );

    const a = new Article();
    a.id = nanoid();
    a.date = new Date().toISOString();
    a.body = '# hi';
    return a;
  }
}
