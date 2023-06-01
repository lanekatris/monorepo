import { EsdbResponse } from '../esdb-format/types';
import { GoogleLocationFile } from './GoogleLocationTypes';

const fs = require('fs');
const glob = require('glob');
// great resource - https://koryp.github.io/Google-Location-History-Parser/
function readFile(path: string): Promise<GoogleLocationFile> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      const r = JSON.parse(data);
      resolve(r);
    });
  });
}

const headers = [
  'placeId',
  'name',
  'address',
  'placeVisitType',
  'placeVisitImportance',
  'visitConfidence',
  'placeConfidence',
  'start',
  'end',
];
const headerLine = headers.join(',');

export default async function parseGoogleLocationHistory() {
  const files = glob(
    // 'C:\\Users\\looni\\Downloads\\takeout-20221008T153547Z-001\\Takeout\\Location History\\Semantic Location History\\2022\\2022_JANUARY.json',
    'C:\\Users\\looni\\Downloads\\takeout-20221008T153547Z-001\\Takeout\\Location History\\Semantic Location History\\**\\*.json',
    async (err, res) => {
      console.log({ err, res });

      let lines: string[] = [headerLine];
      let index = 1;

      for (const fileName of res) {
        console.log(`processing ${index}/${res.length}`, fileName);
        const contents = await readFile(fileName);

        const newLines = contents.timelineObjects
          .filter((x) => x.placeVisit)
          .map((x) => {
            const {
              location: { placeId, name, address },
              placeConfidence,
              visitConfidence,
              placeVisitType,
              placeVisitImportance,
              duration: { startTimestamp, endTimestamp },
            } = x.placeVisit;
            const d = [
              placeId,
              name,
              address,
              placeVisitType,
              placeVisitImportance,
              visitConfidence,
              placeConfidence,
              startTimestamp
                ? new Date(startTimestamp).toLocaleDateString('en-US')
                : '',
              endTimestamp
                ? new Date(endTimestamp).toLocaleDateString('en-US')
                : '',
            ];

            return `${d
              .map((x) => x || '')
              .map((x) => x.toString().replace(/,/g, ''))
              .join(',')}`;
          });
        lines = [...lines, ...newLines];
        index++;
      }

      fs.writeFileSync(`./testies-${Date.now()}.csv`, lines.join('\n'));
    }
  );
}
