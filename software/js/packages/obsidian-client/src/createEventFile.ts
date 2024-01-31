import { ObsidianApi } from './ObsidianApi';

type EventFileType =
  | 'indoor-climbing'
  | 'disc-golf'
  | 'volleyball'
  | 'grilled'
  | 'paintball'
  | 'basketball'
  | 'family-time'
  | 'escape-room';

const ma: { [k in EventFileType]: string } = {
  'escape-room': 'Escape Room',
  paintball: 'Paintball',
  grilled: 'Grilled',
  volleyball: 'Volleyball',
  'disc-golf': 'Disc Golf',
  'indoor-climbing': 'Indoor Climbing',
  basketball: 'Basketball',

  'family-time': 'Family Time',
};

export function createEventFile(type: EventFileType) {
  return async function (obsidian: ObsidianApi) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const d = moment().format('YYYY-MM-DD');
    const path = `/Adventures/${d} ${ma[type]}.md`;
    obsidian.app.vault.create(
      path,
      `
---
title: ${ma[type]}
allDay: true
date: ${d}
completed: null
---

`
    );
  };
}

type FeedType = 'high' | 'low';

const feedMap: { [k in FeedType]: string } = {
  high: 'HighLow - High - ',
  low: 'HighLow - Low - ',
};

export function createFeedFile(type: FeedType) {
  return async function (obsidian: ObsidianApi) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const d = moment().format('YYYY-MM-DD');
    const path = `/Feed/${d} ${feedMap[type]}.md`;
    obsidian.app.vault.create(
      path,
      `

`
    );
  };
}
