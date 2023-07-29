import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CacheItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  url!: string;

  @Column({ type: 'text' })
  html!: string;

  @Column({ default: () => 'current_timestamp', type: 'datetime' })
  createdOn!: string;
}
