import { Entry } from './types';
import { getFilesToProcess } from './getFilesToProcess';
import { readFile } from './readFile';

const fs = require('fs');

const excludedEventTypes = [
  '$>',
  '$metadata',
  '$ProjectionUpdated',
  '$ProjectionCreated',
  '$ProjectionsInitialized',
  '$Checkpoint',
  '$@',
  'PersistentConfig1',
  '$ProjectionCheckpoint',
  'SubscriptionCheckpoint',
];
export default async function esdbFormat() {
  const fileNames = getFilesToProcess(
    `C:\\Users\\looni\\OneDrive\\Backup\\lightsail-esdb-export-2022-10-17\\data`
  );

  // let entries: Entry[] = [];
  let lines = '';
  for (const fileName of fileNames) {
    const response = await readFile(fileName);
    // entries = [
    //   ...entries,
    //   ...response.filter((x) => !excludedEventTypes.includes(x.eventType)),
    //   // ...response.filter((x) => x.eventType === 'health-observation'),
    // ];
    // lines = [...lines, JSON.stringify(response)];
    lines += `${JSON.stringify(response)}\n`;
  }

  const eventTypes = new Set();
  // entries.forEach((x) => eventTypes.add(x.eventType));
  // console.log('event types', eventTypes);

  // console.log('creating file with entry count: ' + entries.length);
  // fs.writeFileSync('testies.json', JSON.stringify(entries, null, 2));
  fs.writeFileSync('testies.jsonl', lines);
  console.log('generated file testies.json');
}
