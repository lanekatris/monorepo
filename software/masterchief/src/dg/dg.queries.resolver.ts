import { Args, Field, InputType, Query, Resolver } from '@nestjs/graphql';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { ESDB } from '../app/utils/constants';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { DgService, Disc, DiscStatus } from './dg.service';
import { GuardMe } from '../auth/guard-me.guard';

@InputType()
export class DiscsInput {
  @Field(() => [DiscStatus], { nullable: true })
  statuses?: DiscStatus[];
}

@Resolver(() => Disc)
@UseGuards(GuardMe)
export class DgQueriesResolver {
  private readonly logger = new Logger(DgQueriesResolver.name);

  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Query(() => [Disc])
  async discs(
    @Args('input', { nullable: true }) input?: DiscsInput,
  ): Promise<Disc[]> {
    const discs = await this.service.getDiscs();
    if (input?.statuses?.length) {
      return discs.filter((disc) => input.statuses.includes(disc.status));
    }
    return discs;
  }
}
