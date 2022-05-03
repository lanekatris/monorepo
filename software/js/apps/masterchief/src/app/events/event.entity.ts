import {Column, CreateDateColumn, Entity, Generated, PrimaryColumn} from "typeorm";
import {v4 as uuid} from 'uuid'
import {createUnionType, Field, ID, ObjectType, registerEnumType} from "@nestjs/graphql";
import {AdventureCreatedEventData, EventsData} from "./events.resolver";

export enum EventEntityType {
  TEST_CREATED = 'test.created',
  ADVENTURE_CREATED = 'adventure.created',
}
registerEnumType(EventEntityType, {
  name: 'EventEntityType'
})

type idk = AdventureCreatedEventData;
export const EventDataUnion = createUnionType({
  name: 'EventDataUnion',
  types: () => [AdventureCreatedEventData] as const,
  resolveType(value) {
    console.log('value is', value);
    return AdventureCreatedEventData
  }
})


@ObjectType({description: 'Event sourcing event'})
@Entity()
export class EventEntity {
  @Field(() => ID)
  @PrimaryColumn({type: 'nvarchar', length: 36})
  @Generated('uuid')
  eventId: string;

  @Field(() => String)
  @Column()
  aggregateId: string;

  @Field(() => EventEntityType)
  @Column({enum: EventEntityType})
  type: EventEntityType

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Column({nullable: true, type: 'json'})
  data?: idk

  @Field(() => EventDataUnion, {nullable: true})
  get eventData(): typeof EventDataUnion {
    if (!this.data) return undefined;

    switch (this.type) {
      case EventEntityType.ADVENTURE_CREATED:
        return {
          ...this.data,
          date: new Date(this.data.date)
        }
        break;
      case EventEntityType.TEST_CREATED:
      default:
        throw new Error('idk what to do')
        break;

    }
  }
}
