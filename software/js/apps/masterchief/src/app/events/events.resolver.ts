import {QueryBus} from "@nestjs/cqrs";
import {Query, Resolver} from "@nestjs/graphql";
import {EventEntity} from "./event.entity";
import {GetEventsRequest, GetEventsResponse} from "./get-events.query";

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(() => GetEventsResponse)
  async events(): Promise<GetEventsResponse> {
    const entities = await this.queryBus.execute(new GetEventsRequest()) as GetEventsResponse;
    return entities;
  }
}
