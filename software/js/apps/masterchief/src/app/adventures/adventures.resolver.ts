import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {Adventure, CreateAdventureInput, LogFoodInput, LogMaintenanceInput} from './models/adventure';
import { AdventureService } from './adventure-service';
import {Inject, Logger} from "@nestjs/common";
import {ESDB} from "../constants";
import {EventStoreDBClient, jsonEvent} from "@eventstore/db-client";
import {FoodLogged, MaintenanceLogged} from "./events/adventure-created";
import { nanoid } from 'nanoid'

@Resolver(() => Adventure)
export class AdventuresResolver {
  private readonly logger = new Logger(AdventuresResolver.name);
  constructor(private service: AdventureService,
              @Inject(ESDB)
              private client: EventStoreDBClient
              ) {}

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

  @Mutation(() => Boolean)
  async foodLog(@Args({name:'input'}) input: LogFoodInput): Promise<boolean>{
    const event = jsonEvent<FoodLogged>({
      type: 'FoodLogged',
      data: {
        ...input,
        id: nanoid(),
        date: input.date || new Date()
      }
    });
    this.logger.log(`Created food log: ${JSON.stringify(event.data)}`)
    await this.client.appendToStream('testies', event);
    return true;
  }
  @Mutation(() => Boolean)
  async maintenanceCreate(@Args({name:'input'}) input: LogMaintenanceInput):Promise<boolean>{
    const event = jsonEvent<MaintenanceLogged>({
      type: 'MaintenanceLogged',
      data: {
        ...input,
        id: nanoid(),
        date: input.date || new Date()
      }
    })

    await this.client.appendToStream('testies', event);
    this.logger.log(`Created maintenance log: ${JSON.stringify(event.data)}`)
    return true;
  }
}
