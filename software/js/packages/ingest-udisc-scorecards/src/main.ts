import { readFileSync, writeFileSync } from 'fs';
import { parseScorecard, generateScorecardMarkdown } from './parse-scorecard';

async function go() {
  console.log('Loading and generating scorecard markdown...');
  const raw = readFileSync(
    '/home/lane/git/monorepo/data/scorecards-source.csv'
  ).toString();
  const result = await parseScorecard(raw);
  const md = generateScorecardMarkdown(result);
  writeFileSync(
    '/home/lane/Documents/lkat-vault/Public/Disc Golf Scorecards.md',
    md
  );
  console.log('done');
}

go();
