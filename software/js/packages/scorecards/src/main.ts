import { readFileSync, writeFileSync } from 'fs';
import { parseScorecard } from './parse-scorecard';
import { generateScorecardMarkdown } from './generate-scorecard-markdown';

async function go() {
  console.log('Loading and generating scorecard markdown...');
  const raw = readFileSync(
    '/home/lane/git/monorepo/data/scorecards-source.csv'
  ).toString();
  const result = await parseScorecard({
    csv: raw,
    playerName: 'Lane',
  });
  const md = generateScorecardMarkdown(result);
  writeFileSync(
    '/home/lane/Documents/lkat-vault/Public/Disc Golf Scorecards.md',
    md
  );
  console.log('done');
}

go();
