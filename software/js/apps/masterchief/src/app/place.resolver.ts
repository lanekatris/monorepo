import {Query, Resolver} from "@nestjs/graphql";
import {Place} from "./place.entity";
import {AppService, GetDataRequest, GetDataResponse} from "./app.service";
import {QueryBus} from "@nestjs/cqrs";

@Resolver(of => Place)
export class PlaceResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @Query(returns => [Place])
  async places(): Promise<Place[]> {
    const result = await this.queryBus.execute(new GetDataRequest()) as GetDataResponse
    return result.places;
  }
}
