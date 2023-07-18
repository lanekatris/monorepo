// import fs from 'fs';
import { readFileSync } from 'fs';
// const fs = require('fs');
import { join } from 'path';
import { parseScorecard, generateScorecardMarkdown } from './parse-scorecard';

describe('dg', () => {
  describe('scorecard', () => {
    it('parse successfully', async () => {
      const body = readFileSync(join(__dirname, 'scorecards.csv')).toString();
      // console.log(body)
      // add csv file
      const result = await parseScorecard(body);
      const md = generateScorecardMarkdown(result);
      console.log(md);
      // expect(result).toBeNull();
      expect(md.length).toBeGreaterThan(0);
    });
  });
});
