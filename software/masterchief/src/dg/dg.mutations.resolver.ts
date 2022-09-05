import {
  Args,
  Field,
  ID,
  InputType,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { DgService, Disc, DiscStatus } from './dg.service';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
import { DiscLost } from './types/disc-lost';
import { EventNames } from './types/disc-added';
import { DiscStatusUpdated } from './types/disc-status-updated';

import { Inject, Logger } from '@nestjs/common';
import { ESDB } from '../app/utils/constants';
import { DiscColorUpdated } from './types/disc-color-updated';
@InputType()
export class DiscLostInput {
  @Field(() => ID)
  discId: string;
}

@InputType()
export class DiscStatusInput extends DiscLostInput {
  @Field(() => DiscStatus)
  status: DiscStatus;
}

@InputType()
export class DiscColorInput extends DiscLostInput {
  @Field()
  color: string;
}

@Resolver(() => Disc)
export class DgMutationsResolver {
  private readonly logger = new Logger(DgMutationsResolver.name);

  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Mutation(() => Disc, { nullable: true })
  async discLost(@Args('input') input: DiscLostInput): Promise<Disc> {
    const { discId } = input;

    const discsFirst = await this.service.getDiscs();
    if (!discsFirst.find((x) => x.id === discId)) {
      this.logger.warn(`Disc not found for id: ${discId}, not doing anything`);
      return null;
    }

    const event = jsonEvent<DiscLost>({
      type: EventNames.DiscLost,
      data: {
        discId,
        date: new Date(),
      },
    });
    await this.client.appendToStream('testies', event);

    const discs = await this.service.getDiscs();
    return discs.find((x) => x.id === discId);
  }

  @Mutation(() => Disc, { nullable: true })
  async discStatus(@Args('input') input: DiscStatusInput): Promise<Disc> {
    const { discId, status } = input;

    const discsFirst = await this.service.getDiscs();
    if (!discsFirst.find((x) => x.id === discId)) {
      this.logger.warn(`Disc not found for id: ${discId}, not doing anything`);
      return null;
    }

    const event = jsonEvent<DiscStatusUpdated>({
      type: EventNames.DiscStatusUpdated,
      data: {
        discId,
        date: new Date(),
        status,
      },
    });

    await this.client.appendToStream('testies', event);

    const discs = await this.service.getDiscs();
    return discs.find((x) => x.id === discId);
  }

  @Mutation(() => Disc, { nullable: true })
  async discColor(@Args('input') input: DiscColorInput): Promise<Disc> {
    const { discId, color } = input;

    const discsFirst = await this.service.getDiscs();
    if (!discsFirst.find((x) => x.id === discId)) {
      this.logger.warn(`Disc not found for id: ${discId}, not doing anything`);
      return null;
    }

    const event = jsonEvent<DiscColorUpdated>({
      type: EventNames.DiscColorUpdated,
      data: {
        discId,
        date: new Date(),
        color,
      },
    });

    await this.client.appendToStream('testies', event);

    const discs = await this.service.getDiscs();
    return discs.find((x) => x.id === discId);
  }
}
