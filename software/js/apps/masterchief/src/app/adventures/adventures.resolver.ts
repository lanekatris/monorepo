import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Adventure,
  CreateAdventureInput,
  LogFoodInput,
  LogMaintenanceInput,
  Movie,
  MovieInput,
  MovieType,
} from './models/adventure';
import { AdventureService } from './adventure-service';
import { Inject, Logger } from '@nestjs/common';
import { ESDB } from '../constants';
import { EventStoreDBClient, jsonEvent, START } from '@eventstore/db-client';
import {
  FoodLogged,
  MaintenanceLogged,
  MovieEvents,
  MovieInterest,
  MovieWatched,
} from './events/adventure-created';
import { nanoid } from 'nanoid';

@Resolver(() => Adventure)
export class AdventuresResolver {
  private readonly logger = new Logger(AdventuresResolver.name);
  constructor(
    private service: AdventureService,
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
  async foodLog(
    @Args({ name: 'input' }) input: LogFoodInput
  ): Promise<boolean> {
    const event = jsonEvent<FoodLogged>({
      type: 'FoodLogged',
      data: {
        ...input,
        id: nanoid(),
        date: input.date || new Date(),
      },
    });
    this.logger.log(`Created food log: ${JSON.stringify(event.data)}`);
    await this.client.appendToStream('testies', event);
    return true;
  }
  @Mutation(() => Boolean)
  async maintenanceCreate(
    @Args({ name: 'input' }) input: LogMaintenanceInput
  ): Promise<boolean> {
    const event = jsonEvent<MaintenanceLogged>({
      type: 'MaintenanceLogged',
      data: {
        ...input,
        id: nanoid(),
        date: input.date || new Date(),
      },
    });

    await this.client.appendToStream('testies', event);
    this.logger.log(`Created maintenance log: ${JSON.stringify(event.data)}`);
    return true;
  }

  @Mutation(() => Boolean)
  async movie(@Args({ name: 'input' }) input: MovieInput): Promise<boolean> {
    switch (input.type) {
      case MovieType.Interested:
        const event = jsonEvent<MovieInterest>({
          type: 'Movie_Interest',
          data: {
            date: new Date(),
            name: input.movieName,
          },
        });
        await this.client.appendToStream('testies', event);
        this.logger.log(`Created evennt`, event);
        break;
      case MovieType.Watched:
        const event2 = jsonEvent<MovieWatched>({
          type: 'Movie_Watched',
          data: {
            name: input.movieName,
            date: new Date(),
          },
        });
        await this.client.appendToStream('testies', event2);
        break;
      default:
        throw new Error(`Unknown type: ${input.type}`);
    }
    return true;
  }

  @Query(() => [Movie])
  async movies(): Promise<Movie[]> {
    const events = this.client.readStream<MovieEvents>('testies', {
      direction: 'forwards',
      fromRevision: START,
      maxCount: 1000,
    });

    const movies: Movie[] = [];
    for await (const { event } of events) {
      switch (event.type) {
        case 'Movie_Interest':
          const movie = movies.find((x) => x.name === event.data.name);
          if (movie) {
            movie.watched = false;
          } else {
            movies.push({
              name: event.data.name,
              watched: false,
            });
          }

          break;
        case 'Movie_Watched':
          const movie2 = movies.find((x) => x.name === event.data.name);
          if (movie2) {
            movie2.watched = true;
          }
          break;
      }
    }

    return movies;
  }
}
