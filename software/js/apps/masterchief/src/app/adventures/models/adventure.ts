import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {MaintenanceTarget} from "../events/adventure-created";

export enum AdventureActivity {
  OUTDOOR_ROCK_CLIMBING = 'Outdoor Rock Climbing',
  VOLLEYBALL = 'Volleyball',
}
registerEnumType(AdventureActivity, {
  name: 'AdventureActivity',
});

registerEnumType(MaintenanceTarget, {
  name: 'MaintenanceTarget'
})

@ObjectType()
export class Adventure {
  @Field(() => ID)
  id: string;

  @Field(() => Date)
  date: Date;

  @Field(() => [AdventureActivity])
  activities: AdventureActivity[];
}

@InputType()
export class CreateAdventureInput {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => [AdventureActivity])
  activities: AdventureActivity[];
}

@InputType()
export class LogFoodInput {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String)
  name: string

  @Field(() => Boolean, {nullable: true})
  usedBlackStone?: boolean

  @Field(() => String, {nullable: true})
  location?: string
}

@InputType()
export class LogMaintenanceInput {
  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => String)
  name: string

  @Field(() => MaintenanceTarget)
  target: MaintenanceTarget
}
