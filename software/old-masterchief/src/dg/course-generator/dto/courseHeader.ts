export class CourseHeader {
  id: string;

  name: string;

  city: string;

  state: string;

  zip: string;

  holeCount: number;

  rating?: number;

  // eslint-disable-next-line max-len
  constructor(
    id: string,
    public courseUrl: string,
    name: string,
    city: string,
    state: string,
    zip: string,
    holeCount: number,
    rating: number,
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
