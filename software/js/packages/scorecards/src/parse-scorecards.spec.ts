import { readFileSync } from 'fs';
import { processScorecards } from 'packages/scorecards/src/process-scorecards';
import { getPlayerTimeInYears } from './get-player-time-in-years';

const csv = readFileSync(
  '/home/lane/git/monorepo/data/scorecards-jessie-source.csv'
).toString();

test('Returns a list of scorecards', async () => {
  const result = await processScorecards({
    csv,
    playerName: 'JJHACKN',
    // excludes: ['2022-10-15 14:50'],
  });
  console.log(result.stats);
  console.log(result.scorecards[0]);
  expect(result.scorecards.length).toBeGreaterThan(0);
});

test('How long have you been playing happy path', () => {
  const input = '2015-08-11 19:05';
  const output = getPlayerTimeInYears(input);
  expect(output).toBe('7 years');
});

test(`If you've been playing for less than a year`, () => {
  const input = '2015-08-11 19:05';
  const output = getPlayerTimeInYears(input, new Date('2015-09-05'));
  expect(output).toBe('Less than a year');
});

// uniq courses played

// generate sqlite
// generate json file
// generate raw
// type errors
