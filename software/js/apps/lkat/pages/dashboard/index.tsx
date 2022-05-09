import feedlyData from '../../public/feedly.json';
import { sumBy } from 'lodash';
import { MetricCard } from '../../components/metric-card/metric-card';
import csv from 'csvtojson';
import path from 'path';
import groupBy from 'lodash/groupBy';
import pick from 'lodash/pick';
import min from 'lodash/min';
import max from 'lodash/max';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import { differenceInYears } from 'date-fns';
import uniqBy from 'lodash/uniqBy';
import countBy from 'lodash/countBy';
import chain from 'lodash/chain';
import _ from 'lodash';

export const getStaticProps = async () => {
  const p = path.resolve(
    __dirname,
    `../../../public/udisc-scorecards-05-03-2022.csv`
  );
  const rounds = await csv().fromFile(p);
  const final = rounds
    .filter((x) => x.PlayerName === 'Lane')
    .map((x) => ({ ...x, _parsedOverUnder: parseInt(x['+/-']) }));

  const a = path.resolve(
    __dirname,
    `../../../public/Adventures-Exportable-05-03-2022.csv`
  );
  const rawAdventures = await csv().fromFile(a);

  // const adventuresCount = countBy(rawAdventures, x => x.OutdoorActivity)
  const adventuresCount = rawAdventures
    .map((x) => x.OutdoorActivity.split(','))
    .flatMap((x) => x);

  const top5 = _.chain(adventuresCount)
    .countBy((x) => x)
    .toPairs()
    .orderBy((x) => x[1], ['desc'])
    .take(5)
    .map((x) => ({ name: x[0], value: x[1] }))
    .value();

  return {
    props: {
      roundsPlayed: final.length,
      // adventures,
      rawAdventures,
      adventuresCount: rawAdventures.length,
      top5,

      bestRound: minBy(final, '_parsedOverUnder')._parsedOverUnder,
      worstRound: maxBy(final, '_parsedOverUnder')._parsedOverUnder,
      yearsPlayed: differenceInYears(
        final[0].Date,
        final[final.length - 1].Date
      ),
      groupCount: feedlyData.length,
      // final,
      feedCount: sumBy(feedlyData, (x) => x.numFeeds),
    },
  };
};

export default function DashboardPage(props) {
  const {
    groupCount,
    feedCount,
    final,
    roundsPlayed,
    bestRound,
    worstRound,
    yearsPlayed,
    adventuresCount,
    top5,
  } = props;

  // console.log(props);
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

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white mt-10">
        💪 Activity Stats
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This section is inspired by{' '}
        <a
          href="https://www.airtable.com/product/reporting"
          className="text-gray-900 dark:text-gray-100 underline"
          target="_blank"
          rel="noreferrer"
        >
          Airtable visualizations
        </a>
        . They have an awesome data management spreadsheet platform. I actually
        pay for them. Their nicer charting features is limited for my plan;
        which makes sense.
        <br />
        So I wanted to own more of the data and provide similar charts here just
        because!
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <MetricCard metric={adventuresCount} text="Adventures Logged" />
      </div>
      <h1 className="font-bold text-1xl md:text-1xl tracking-tight mb-4 text-black dark:text-white mt-10">
        Most Played Sports
      </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        {top5.map(({ name, value }) => (
          <MetricCard key={name} metric={value} text={name} />
        ))}
      </div>

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white mt-10">
        Disc Golf Stats
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        This data comes from{' '}
        <a
          href="https://udisc.com/"
          className="text-gray-900 dark:text-gray-100 underline"
          target="_blank"
          rel="noreferrer"
        >
          UDisc
        </a>
        . I haven't always used the app and have missing rounds but I'm using
        the data they give me which isn't half bad. I'll dig into the data more
        as time goes on. Their app has nice stats but I wanted to analyze it
        here just 'cuz.
      </p>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 my-2 w-full">
        <MetricCard metric={roundsPlayed} text="Rounds Played" />
        <MetricCard metric={bestRound} text="Best Round" color="green" />
        <MetricCard metric={worstRound} text="Worst Round" color="red" />
        <MetricCard metric={yearsPlayed} text="Years Played" />
      </div>

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white mt-10">
        My GitHub Commits
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Take this with a grain of salt, I'm moving my private repos to being
        public. I'm bad about committing secrets 🤷‍♂️
      </p>
      <a href="https://github.com/lanekatris" target="_blank" rel="noreferrer">
        <img
          className="mt-5 mb-5"
          src="https://ghchart.rshah.org/lanekatris"
          alt="Lane's GitHub Contribution Chart"
          width="600"
        />
      </a>

      <h1 className="font-bold text-2xl md:text-3xl tracking-tight mb-4 text-black dark:text-white mt-10">
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
    </main>
  );
}
