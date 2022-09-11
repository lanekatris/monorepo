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
import { DiscAdded, DiscRemoved, EventNames } from './types/disc-added';
import { DiscStatusUpdated } from './types/disc-status-updated';

import { Inject, Logger } from '@nestjs/common';
import { ESDB } from '../app/utils/constants';
import { DiscColorUpdated } from './types/disc-color-updated';
import { nanoid } from 'nanoid';
import { isDate } from 'lodash';

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

@InputType()
export class DiscCreateInput {
  @Field(() => Date, { nullable: true })
  date?: Date;
  @Field()
  brand: string;
  @Field()
  model: string;
  @Field({ nullable: true })
  color?: string;
}

@InputType()
export class DiscRemoveInput extends DiscLostInput {}

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

  @Mutation(() => Disc)
  async discCreate(@Args('input') input: DiscCreateInput): Promise<Disc> {
    const { date, brand, model } = input;
    const discId = nanoid();
    const event = jsonEvent<DiscAdded>({
      type: EventNames.DiscAdded,
      data: {
        id: discId,
        date: isDate(date) ? date : new Date(),
        brand,
        model,
      },
    });
    await this.client.appendToStream('testies', event);

    const discs = await this.service.getDiscs();
    return discs.find((x) => x.id === discId);
  }

  @Mutation(() => Disc)
  async discRemove(
    @Args('input') input: DiscRemoveInput,
  ): Promise<Partial<Disc>> {
    const { discId } = input;
    const event = jsonEvent<DiscRemoved>({
      type: EventNames.DiscRemoved,
      data: {
        date: new Date(),
        id: discId,
      },
    });
    await this.client.appendToStream('testies', event);
    return {
      id: discId,
      deleted: true,
    };
  }
}
