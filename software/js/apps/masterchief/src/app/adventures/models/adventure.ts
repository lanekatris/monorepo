import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';

export enum AdventureActivity {
  OUTDOOR_ROCK_CLIMBING = 'Outdoor Rock Climbing',
  VOLLEYBALL = 'Volleyball',
}
registerEnumType(AdventureActivity, {
  name: 'AdventureActivity',
});

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
