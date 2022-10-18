import { useLatestEventNamesQuery } from '../graphql';
import { eventNameOptions } from '../pages/feed/feed';

export function useEventNames() {
  const { data } = useLatestEventNamesQuery();

  const options = [
    {
      label: 'Recent',
      options: (data?.latestEventNames || []).map((x) => ({
        label: x,
        value: x,
      })),
    },
    {
      label: 'All',
      options: eventNameOptions,
    },
  ];

  return options;
}
