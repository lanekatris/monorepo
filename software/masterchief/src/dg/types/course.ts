export class DiscGolfCourse {
  public constructor(
    public id: string,
    public name: string,
    public latitude: number,
    public longitude: number,
    public hasPlayed: boolean,
    public distanceFromHome: CourseDistanceFromHome,
  ) {}
}

export class CourseDistanceFromHome {
  public feet: number;
  constructor(public meters: number) {
    this.feet = this.meters * 3;
  }
}
