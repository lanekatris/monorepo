import {Column, CreateDateColumn, Entity, PrimaryColumn} from "typeorm";
import {v4 as uuid} from 'uuid'
import {Field, ID, ObjectType} from "@nestjs/graphql";

@ObjectType({description: 'Event sourcing event'})
@Entity()
export class EventEntity {
  @Field(() => ID)
  @PrimaryColumn({type: 'nvarchar', length: 36})
  id: string = uuid()

  @Field(() => String)
  @Column()
  aggregateId: string;

  @Field(() => String)
  @Column()
  type: string;

  @Field(() => Date)
  @CreateDateColumn()
  created: Date;

  @Field(() => String, {nullable:true})
  @Column({nullable: true, type: 'json'})
  data?: string
}
