import {
  Scorecard,
  ScorecardResponse,
} from 'packages/scorecards/src/scorecard';
import { getMarkdownTable } from 'markdown-table-ts';

export function generateScorecardMarkdown(response: ScorecardResponse): string {
  const lines = [
    `**Updated**: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
    `**Playing for**: ${response.stats.howLongHaveYouBeenPlaying}`,
    `**Aces**: ${response.stats.aces}`,
    `**Rounds**: ${response.stats.rounds.total}`,
    '',
    getMarkdownTable({
      table: {
        head: ['Date', 'Course', 'Score', 'Players'],
        body: response.scorecards.map(
          ({ courseName, date, myScore, players }) => [
            date.toLocaleDateString(),
            courseName,
            myScore,
            players.join(', '),
          ]
        ),
      },
    }),
  ];

  return lines.join('\n');
}
