import feedlyData from '../../public/feedly.json';
import { sumBy } from 'lodash';
import { MetricCard } from '../../components/metric-card/metric-card';
import csv from "csvtojson";
import path from 'path';
import groupBy from 'lodash/groupBy'
import pick from 'lodash/pick'
import min from 'lodash/min'
import max from 'lodash/max'
import minBy from 'lodash/minBy'
import maxBy from 'lodash/maxBy'
import { differenceInYears } from 'date-fns'

export const getStaticProps = async () => {
  const p = path.resolve(__dirname, `../../../public/udisc-scorecards-05-03-2022.csv`)
  const rounds = await csv().fromFile(p)
  const final = rounds.filter(x => x.PlayerName === 'Lane').map(x => ({...x,
  _parsedOverUnder: parseInt(x['+/-'])
  }))

  return {
    props: {
      roundsPlayed: final.length,
      bestRound: minBy(final, '_parsedOverUnder')._parsedOverUnder,
      worstRound: maxBy(final, '_parsedOverUnder')._parsedOverUnder,
      yearsPlayed: differenceInYears(final[0].Date, final[final.length - 1].Date),
      groupCount: feedlyData.length,
      final,
      feedCount: sumBy(feedlyData, (x) => x.numFeeds),
    },
  };
};

export default function DashboardPage(props) {
  const { groupCount, feedCount,final, roundsPlayed, bestRound, worstRound, yearsPlayed } =props;

  console.log(props)
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
        >
          here
        </a>
        .
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <MetricCard metric={groupCount} text="Feedly Groups" />
        <MetricCard metric={feedCount} text="Feedly Feeds" />
      </div>

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white mt-10">
        Disc Golf Stats
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This data comes from <a href="https://udisc.com/" className="text-gray-900 dark:text-gray-100 underline" target="_blank" rel="noreferrer">UDisc</a>. I haven't always used the app and have missing rounds but I'm using the data they give me which isn't half bad. I'll dig into the data more as time goes on. Their app has nice stats but I wanted to analyze it here just 'cuz.
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <MetricCard metric={roundsPlayed} text="Rounds Played" />
        <MetricCard metric={bestRound} text="Best Round" color='green' />
        <MetricCard metric={worstRound} text="Worst Round" color="red" />
        <MetricCard metric={yearsPlayed} text="Years Played" />
      </div>
    </main>
  );
}
