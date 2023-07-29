import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  city: string;

  @Column({ type: 'text' })
  state: string;

  @Column({ type: 'text' })
  zip: string;

  @Column('int')
  holeCount: number;

  @Column({ nullable: true, type: 'int' })
  rating?: number;

  @Column({ type: 'text', nullable: true })
  rawLocationData?: string;

  // @Column({ default: 0 })
  // didFindLocations!: boolean;

  @Column({ default: 0, type: 'int' })
  foundLocationCount!: number;

  @Column({ nullable: true, type: 'int' })
  latitude?: number;

  @Column({ nullable: true, type: 'int' })
  longitude?: number;

  @Column({ nullable: true, type: 'text' })
  html?: string;

  // eslint-disable-next-line max-len
  constructor(
    id: string,
    name: string,
    city: string,
    state: string,
    zip: string,
    holeCount: number,
    rating: number
  ) {
    this.id = id;
    this.name = name;
    this.city = city;
    this.state = state;
    this.zip = zip;
    this.holeCount = holeCount;
    this.rating = rating;
  }

  serializeLocation(): string {
    return `${this.name} ${this.city}, ${this.state} ${this.zip}`;
  }
}
