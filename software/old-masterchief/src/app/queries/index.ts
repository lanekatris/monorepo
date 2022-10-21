import { GetHomeModelHandler } from './get-home-model.handler';
import { GetEventsModelHandler } from './get-events-model.handler';
import { GetFeedHandler } from './get-feed.handler';
import { GetFeedHandlerV2 } from './get-feed-v2.handler';

export const QueryHandlers = [
  GetHomeModelHandler,
  GetEventsModelHandler,
  GetFeedHandler,
  GetFeedHandlerV2,
];
