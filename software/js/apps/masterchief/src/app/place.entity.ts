import {Column, Entity, PrimaryColumn} from "typeorm";
import {Field, ID, ObjectType} from "@nestjs/graphql";

@Entity()
@ObjectType({description: 'place'})
export class Place {
  @Field(type => ID)
  @PrimaryColumn()
  id: string

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  state: string
}
