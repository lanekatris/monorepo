import { Entry, EsdbResponse } from './types';
const fs = require('fs');

export function readFile(path: string): Promise<EsdbResponse> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        return reject(err);
      }

      const r: EsdbResponse = JSON.parse(data);
      resolve(r);
    });
  });
}
