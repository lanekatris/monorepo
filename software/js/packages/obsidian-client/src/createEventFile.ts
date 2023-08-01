import { ObsidianApi } from './ObsidianApi';

type EventFileType = 'indoor-climbing' | 'disc-golf' | 'volleyball';
const ma: { [k in EventFileType]: string } = {
  volleyball: 'Volleyball',
  'disc-golf': 'Disc Golf',
  'indoor-climbing': 'Indoor Climbing',
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
