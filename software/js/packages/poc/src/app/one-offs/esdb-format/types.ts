export interface EsdbResponse {
  title: string;
  id: string;
  updated: Date;
  author: Author;
  headOfStream: boolean;
  links: Link[];
  entries: Entry[];
}

export interface Author {
  name: Name;
}

export enum Name {
  EventStore = 'EventStore',
}

export interface Entry {
  eventId: string;
  eventType: string;
  eventNumber: number;
  data?: string;
  streamId: string;
  isJson: boolean;
  isMetaData: boolean;
  isLinkMetaData: boolean;
  positionEventNumber: number;
  positionStreamId: string;
  title: string;
  id: string;
  updated: Date;
  author: Author;
  summary: string;
  links: Link[];
}

export interface Link {
  uri: string;
  relation: string;
}
