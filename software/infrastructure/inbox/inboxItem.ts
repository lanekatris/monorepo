export interface InboxItem {
  id: string;
  eventDate: string;
  body: string;
  version: number;
  processed: boolean;
}

class InboxItemNew {
  constructor() {}
}
