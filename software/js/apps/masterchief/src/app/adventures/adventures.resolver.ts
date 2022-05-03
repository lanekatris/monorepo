import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Adventure, CreateAdventureInput } from './models/adventure';
import { AdventureService } from './adventure-service';

@Resolver(() => Adventure)
export class AdventuresResolver {
  constructor(private service: AdventureService) {}

  @Query(() => [Adventure])
  adventures(): Promise<Adventure[]> {
    return this.service.get();
  }

  @Mutation(() => Boolean)
  async adventureCreate(
    @Args({ name: 'input' }) input: CreateAdventureInput
  ): Promise<boolean> {
    return this.service.create(input);
  }
}
