import { readFileSync, writeFileSync } from 'fs';
import {
  parseScorecardFromCsv,
  processScorecards,
} from 'packages/scorecards/src/process-scorecards';
import { generateScorecardMarkdown } from './generate-scorecard-markdown';

async function go() {
  console.log('Loading and generating scorecard markdown...');
  const raw = readFileSync(
    '/home/lane/git/monorepo/data/scorecards-source.csv'
  ).toString();
  const rawScorecards = await parseScorecardFromCsv(raw);
  const result = await processScorecards({
    rawScorecards,
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
