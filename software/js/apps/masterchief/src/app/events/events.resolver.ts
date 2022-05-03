import {CommandBus, CommandHandler, ICommandHandler, QueryBus} from "@nestjs/cqrs";
import {Args, Field, InputType, Mutation, ObjectType, Query, registerEnumType, Resolver} from "@nestjs/graphql";
import {EventEntity, EventEntityType} from "./event.entity";
import {GetEventsRequest, GetEventsResponse} from "./get-events.query";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {v4 as uuid} from 'uuid'

enum AdventureActivity {
  OUTDOOR_ROCK_CLIMBING='Outdoor Rock Climbing'
}
registerEnumType(AdventureActivity, {
  name: 'AdventureActivity'
})

@InputType()
class CreateAdventureEventInput {
  @Field(() => [AdventureActivity])
  activities: [AdventureActivity]
  @Field({nullable: true})
  date?: Date
}

class CreateAdventureRequest extends  CreateAdventureEventInput{
  constructor(input: CreateAdventureEventInput) {
    super();
    Object.assign(this, input);
  }
}

// @CommandHandler(CreateAdventureEventInput)
// export class CreateAdventureHandler implements ICommandHandler<CreateAdventureEventInput, EventEntity> {
//   execute(command: CreateAdventureEventInput): Promise<EventEntity> {
//     return Promise.resolve(new EventEntity());
//   }
//
// }


// export type AdventureCreatedEventData = CreateAdventureEventInput
// export interface AdventureCreatedEventData  {
//   date: Date
//   activities: AdventureActivity[]
// }



@ObjectType()
export class AdventureCreatedEventData {
  @Field()
  date: Date

  @Field(() => [AdventureActivity])
  activities: AdventureActivity[]
}

export type EventsData = AdventureCreatedEventData

@CommandHandler(CreateAdventureRequest)
export class CreateAdventureHandler implements ICommandHandler<CreateAdventureRequest, EventEntity>{
  constructor(
    @InjectRepository(EventEntity)
    private readonly repo: Repository<EventEntity>
  ) {}

  async execute(command: CreateAdventureRequest): Promise<EventEntity> {
    console.log('final command', command)

    const eventData: AdventureCreatedEventData = {
      ...command,
      date: command.date || new Date()
    }

    const event = this.repo.create({
      aggregateId: uuid(),
      type: EventEntityType.ADVENTURE_CREATED,
      data: eventData
    })

    await this.repo.save(event);
    return event;
  }

}

@Resolver(() => EventEntity)
export class EventsResolver {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Query(() => GetEventsResponse)
  async events(): Promise<GetEventsResponse> {
    const k = await this.queryBus.execute(new GetEventsRequest()) as GetEventsResponse;
    console.log('k', JSON.stringify(k, null, 2))
    return k
  }

  @Mutation(() => EventEntity)
  async eventAdventureCreate(@Args({name: 'input', type: () => CreateAdventureEventInput}) input: CreateAdventureEventInput): Promise<EventEntity>{
    console.log('input', input)

    // const request = {
    //   ...input
    // } as CreateAdventureRequest
    const request = new CreateAdventureRequest(input);
    // send off command
    const result = await this.commandBus.execute(request) as EventEntity;
    return result;
    // const event = await this.queryBus.execute(new Get)
  }
}
