import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Html {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  state!: string;

  @Column({ type: 'int' })
  page!: number;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text' })
  html!: string;

  @Column({ default: () => 'current_timestamp', type: 'datetime' })
  createdOn!: string;
}
