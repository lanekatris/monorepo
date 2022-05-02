import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Place {
  @PrimaryColumn()
  id: string

  @Column()
  name: string
}
