import { default as csvParser } from 'csvtojson';
import { groupBy } from 'lodash';
import {
  HOLE_PROPS,
  RawUdiscScorecardEntry,
} from './raw-udisc-scorecard-entry';
import { ParseScorecardInput, ScorecardResponse } from './scorecard';
import { getPlayerTimeInYears } from './get-player-time-in-years';

export async function parseScorecardFromCsv(
  csv: string
): Promise<RawUdiscScorecardEntry[]> {
  const parsed: RawUdiscScorecardEntry[] = await csvParser().fromString(csv);
  return parsed;
}

// Careful, if you have player name collisions, not sure what that data looks like
export async function processScorecards({
  rawScorecards,
  playerName,
  excludes = [],
}: ParseScorecardInput): Promise<ScorecardResponse> {
  // const parsed: RawUdiscScorecardEntry[] = await csvParser().fromString(csv);
  const grouped = groupBy(rawScorecards, 'startdate');

  let aces = 0;
  let holes = 0;
  let throws = 0;
  let partialRounds = 0;
  let skippedScorecards = 0;
  const skippedScorecardNames: string[] = [];

  const scorecards = Object.keys(grouped)
    .filter((x) => !excludes.includes(x))
    .map((date) => {
      const from: RawUdiscScorecardEntry[] = grouped[date];
      const me = from.find((x) => x.playername.includes(playerName));
      if (!me) {
        skippedScorecards++;
        skippedScorecardNames.push(date);
        return null;
      }
      // if (!me) throw new Error(`${playerName} player not found: ${date}`);

      // const aaa = Object.keys(me).filter(x => HOLE_PROPS.includes(x)).reduce((prev,current) => {
      //   if (prev.length)
      // })

      // if (me['+/-'] !== '') fullRounds++;
      // else partialRounds++;
      let alreadySetRound = false;
      HOLE_PROPS.forEach((hole) => {
        if (alreadySetRound) return;
        // @ts-ignore
        if (me[hole] === 0) {
          partialRounds++;
          alreadySetRound = true;
        }
      });

      HOLE_PROPS.forEach((hole) => {
        // @ts-ignore
        if (me[hole] === 1) aces++;
      });

      // move to iteration above
      HOLE_PROPS.forEach((hole) => {
        if (me.hasOwnProperty(hole) === false) return;
        // @ts-ignore
        if (me[hole] === 0) return;
        // @ts-ignore
        if (me[hole]) holes++;
      });

      HOLE_PROPS.forEach((hole) => {
        if (me.hasOwnProperty(hole) === false) return;
        // @ts-ignore
        if (me[hole]) throws += Number(me[hole]);
      });

      return {
        courseName: from[0].coursename,
        layout: from[0].layoutname,
        date: from[0].startdate,
        players: from
          .filter((x) => x.playername !== 'Par')
          .map((f) => f.playername),
        myScore: me['+/-'],
        // raw: from,
      };
    })
    .filter((x) => x);

  // scorecards[0]

  const idk = groupBy(scorecards, (x) => x?.courseName!);
  const idk2 = Object.keys(idk).reduce((prev, current) => {
    const prevGrouping = idk[prev];
    const currentGrouping = idk[current];
    return prevGrouping.length > currentGrouping.length ? prev : current;
  });
  // console.log('idk', idk2, idk[idk2].length);

  const courseNames = Object.keys(idk);
  courseNames.sort();

  let bestCourseName = '';
  let bestScore = 0;
  scorecards.forEach((x) => {
    if (Number(x?.myScore!) < bestScore) {
      bestCourseName = x?.courseName!;
      bestScore = Number(x?.myScore!);
    }
  });

  const earliestDate = scorecards[scorecards.length - 1];
  const howLongHaveYouBeenPlaying = getPlayerTimeInYears(earliestDate?.date!);

  return {
    // @ts-ignore
    scorecards,
    stats: {
      rounds: {
        // played: scorecards.length, // TODO: I'm one off...
        total: scorecards.length - excludes.length,
        full: scorecards.length - partialRounds - excludes.length,
        partial: partialRounds,
        best: {
          courseName: bestCourseName,
          score: bestScore,
        },
      },
      courses: {
        mostPlayed: {
          name: idk2,
          rounds: idk[idk2].length,
        },
        // names: courseNames,
        // names: [],
        played: courseNames.length, // This may NOT match Udisc since you can check courses you've played without having a scorecard for them
      },
      aces,
      holes,
      throws,
      howLongHaveYouBeenPlaying,
      skippedScorecards,
      skippedScorecardNames,
    },
  };
}
