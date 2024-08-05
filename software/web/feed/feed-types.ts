import { Raindrop } from './raindrop';

export interface Bookmark {
  id: string;
  title: string;
  note: string;
  excerpt: string;
  url: string;
  folder: string;
  tags: string;
  created: string;
  cover: string;
  highlights: string;
  favorite: string;
}

export interface Memo {
  uid: number;
  name: string;
  rowStatus: string;
  creatorId: number;
  createdTs: number;
  updatedTs: number;
  displayTime: string;
  content: string;
  visibility: string;
  pinned: boolean;
  creatorName: string;
  creatorUsername: string;
  _date: Date;

  resources: {
    filename: string;
    type: string;
    name: string;
  }[];
}

export type FeedItemType =
  | 'disc-golf-scorecard'
  | 'climb'
  | 'disc-golf-disc'
  | 'obsidian-adventure'
  // | 'bookmark'
  | 'memo'
  | 'maintenance'
  | 'raindrop';

export interface FeedItem {
  id: string;
  type: FeedItemType;
  date: Date;
  data: {
    climb?: { Route: string; Rating: string; Notes?: string };
    scorecard?: { coursename: string; '+/-': number };
    disc?: {
      brand: string;
      model: string;
      plastic: string;
      number: number;
      weight?: number;
    };
    adventure?: { activity: string; contents?: string; path: string };
    bookmark?: Bookmark;
    memo?: Memo;
    maintenance?: {
      title: string;
      Date: string;
      Property: string;
      Notes: string;
    };
    raindrop?: Raindrop;
  };
}
