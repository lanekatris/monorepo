import {
  Field,
  ID,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ESDB } from '../app/utils/constants';
import { EventStoreDBClient } from '@eventstore/db-client';
import { DgService, Disc } from './dg.service';

// @ObjectType({ description: 'Blog post testies' })
// export class BlogPost {
//   @Field((type) => ID)
//   id: string;
//
//   @Field()
//   title: string;
//
//   @Field()
//   body: string;
// }

@Resolver((of) => Disc)
export class DgResolver {
  constructor(
    @Inject(ESDB)
    private client: EventStoreDBClient,
    @Inject(DgService)
    private service: DgService,
  ) {}

  @Query((returns) => [Disc])
  async discs(): Promise<Disc[]> {
    const discs = await this.service.getDiscs();
    console.log(discs);
    return discs;
  }
}
