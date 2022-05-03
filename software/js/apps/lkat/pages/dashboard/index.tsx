import feedlyData from '../../public/feedly.json';
import { sumBy } from 'lodash';
import { MetricCard } from '../../components/metric-card/metric-card';

export const getStaticProps = () => {
  console.log('feedly', feedlyData.length);
  return {
    props: {
      groupCount: feedlyData.length,
      feedCount: sumBy(feedlyData, (x) => x.numFeeds),
    },
  };
};

export default function DashboardPage({ groupCount, feedCount }) {
  return (
    <main className="container px-6 mx-auto max-w-2xl">
      <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-4 text-black dark:text-white">
        Dashboard
      </h1>
      <div className="mb-8">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is a dashboard for the hodge podge of data I want to show from
          various sources. Inspired by:{' '}
          <a
            className="text-gray-900 dark:text-gray-100 underline"
            href="https://leerob.io/dashboard"
            target="_blank"
            rel="noreferrer"
          >
            Lee Robinson
          </a>
        </p>
      </div>

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white">
        Feedly Stats
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        You can download my Feedly data in{' '}
        <a
          href="/feedly.json"
          className="text-gray-900 dark:text-gray-100 underline"
          target="_blank"
        >
          JSON
        </a>{' '}
        or{' '}
        <a
          href="/feedly-515a3dea-049d-4199-804b-8decb309625a-2022-05-03.opml"
          className="text-gray-900 dark:text-gray-100 underline"
        >
          {' '}
          OPML
        </a>
        . Last updated: <i>5/3/2022</i>
        <br />
        I may show the data in time and I plan on automating the creation of
        these files too.
        <br />I got the OPML from{' '}
        <a
          href="https://feedly.com/i/opml"
          className="text-gray-900 dark:text-gray-100 underline"
          target="_blank"
          rel="noreferrer"
        >
          here
        </a>{' '}
        and the JSON{' '}
        <a
          href="https://cloud.feedly.com/v3/collections"
          target="_blank"
          rel="noreferrer"
          className="text-gray-900 dark:text-gray-100 underline"
          target="_blank"
        >
          here
        </a>
        .
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <MetricCard metric={groupCount} text="Feedly Groups" />
        <MetricCard metric={feedCount} text="Feedly Feeds" />
      </div>
    </main>
  );
}
