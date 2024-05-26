export interface Raindrop {
  _id: number;
  link: string;
  title: string;
  excerpt: string;
  note: string;
  type: string;
  user: User;
  cover: string;
  media: any[];
  tags: any[];
  important: boolean;
  reminder: Reminder;
  removed: boolean;
  created: string;
  collection: Collection;
  highlights: any[];
  lastUpdate: string;
  domain: string;
  creatorRef: CreatorRef;
  sort: number;
  collectionId: number;
}

export interface Collection {
  $ref: string;
  $id: number;
  oid: number;
}

export interface CreatorRef {
  _id: number;
  avatar: string;
  name: string;
  email: string;
}

export interface Reminder {
  date: null;
}

export interface User {
  $ref: string;
  $id: number;
}
