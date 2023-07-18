export interface SourceInfo {
  deviceTag: number;
}

export interface StartLocation {
  latitudeE7: number;
  longitudeE7: number;
  sourceInfo: SourceInfo;
}

export interface SourceInfo2 {
  deviceTag: number;
}

export interface EndLocation {
  latitudeE7: number;
  longitudeE7: number;
  sourceInfo: SourceInfo2;
}

export interface Duration {
  startTimestamp: Date;
  endTimestamp: Date;
}

export interface Activity {
  activityType: string;
  probability: number;
}

export interface Waypoint {
  latE7: number;
  lngE7: number;
}

export interface RoadSegment {
  placeId: string;
  duration: string;
}

export interface WaypointPath {
  waypoints: Waypoint[];
  source: string;
  roadSegment: RoadSegment[];
  distanceMeters: number;
  travelMode: string;
  confidence: number;
}

export interface Point {
  latE7: number;
  lngE7: number;
  accuracyMeters: number;
  timestamp: Date;
}

export interface SimplifiedRawPath {
  points: Point[];
}

export interface Location {
  latitudeE7: number;
  longitudeE7: number;
  accuracyMetres: number;
}

export interface ParkingEvent {
  location: Location;
  method: string;
  locationSource: string;
  timestamp: Date;
}

export interface ActivitySegment {
  startLocation: StartLocation;
  endLocation: EndLocation;
  duration: Duration;
  distance: number;
  activityType: string;
  confidence: string;
  activities: Activity[];
  waypointPath: WaypointPath;
  simplifiedRawPath: SimplifiedRawPath;
  parkingEvent: ParkingEvent;
}

export interface SourceInfo3 {
  deviceTag: number;
}

export interface Location2 {
  latitudeE7: number;
  longitudeE7: number;
  placeId: string;
  address: string;
  sourceInfo: SourceInfo3;
  locationConfidence: number;
  calibratedProbability: number;
  semanticType: string;
  name: string;
}

export interface Duration2 {
  startTimestamp: Date;
  endTimestamp: Date;
}

export interface OtherCandidateLocation {
  latitudeE7: number;
  longitudeE7: number;
  placeId: string;
  address: string;
  name: string;
  locationConfidence: number;
  calibratedProbability: number;
  semanticType: string;
}

export interface Point2 {
  latE7: number;
  lngE7: number;
  accuracyMeters: number;
  timestamp: Date;
}

export interface SimplifiedRawPath2 {
  points: Point2[];
  source: string;
  distanceMeters: number;
}

export interface PlaceVisit {
  location: Location2;
  duration: Duration2;
  placeConfidence: string;
  centerLatE7: number;
  centerLngE7: number;
  visitConfidence: number;
  otherCandidateLocations: OtherCandidateLocation[];
  editConfirmationStatus: string;
  locationConfidence: number;
  placeVisitType: string;
  placeVisitImportance: string;
  simplifiedRawPath: SimplifiedRawPath2;
}

export interface TimelineObject {
  activitySegment: ActivitySegment;
  placeVisit: PlaceVisit;
}

export interface GoogleLocationFile {
  timelineObjects: TimelineObject[];
}
