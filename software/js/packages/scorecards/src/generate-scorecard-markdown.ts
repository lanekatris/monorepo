import { Scorecard } from 'packages/scorecards/src/scorecard';
import { getMarkdownTable } from 'markdown-table-ts';

export function generateScorecardMarkdown(scorecards: Scorecard[]): string {
  return getMarkdownTable({
    table: {
      head: ['Date', 'Course', 'Score', 'Players'],
      body: scorecards.map(({ courseName, date, myScore, players }) => [
        date,
        courseName,
        myScore,
        players.join(', '),
      ]),
    },
  });
}
