import { Inject, UseGuards } from '@nestjs/common';
import { GuardMe } from '../auth/guard-me.guard';
import {
  Args,
  Field,
  InputType,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { EventStoreDBClient } from '@eventstore/db-client';

import { ESDB } from './utils/constants';

import {
  FeedEvent,
  FeedResponse,
  GetFeedQueryV2,
  LanesCustomEvents,
} from './queries/get-feed-v2.handler';
import { EventNames } from '../dg/types/disc-added';
import { DiscLostInput } from '../dg/dg.mutations.resolver';

registerEnumType(EventNames, {
  name: 'EventName',
});

@InputType()
export class FeedInput {
  @Field(() => [EventNames])
  types: EventNames[];
}

@Resolver(() => FeedEvent)
@UseGuards(GuardMe)
export class AppQueriesResolver {
  constructor(
    private readonly queryBus: QueryBus,
    @Inject(ESDB)
    private esdb: EventStoreDBClient,
  ) {}

  @Query(() => FeedResponse)
  async feed(@Args('input') input: FeedInput): Promise<FeedResponse> {
    const events = await this.queryBus.execute(new GetFeedQueryV2(input.types));
    return new FeedResponse(events);
  }
}
