import {IQueryHandler, QueryHandler} from "@nestjs/cqrs";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {EventEntity} from "./event.entity";
import {Field, ObjectType} from "@nestjs/graphql";

export class GetEventsRequest {}

@ObjectType()
export class GetEventsResponse {
  @Field(() => [EventEntity])
  events: EventEntity[]
}

@QueryHandler(GetEventsRequest)
export class GetEventsHandler implements IQueryHandler<GetEventsRequest, GetEventsResponse>{
  constructor(
    @InjectRepository(EventEntity)
    private readonly repo: Repository<EventEntity>
  ) {}

  async execute(query: GetEventsRequest): Promise<GetEventsResponse> {
    const e = await this.repo.find();
    return {
      events: e
    }
  }
}
