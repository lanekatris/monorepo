// import esdbExport from './app/one-offs/esdb-export';

import esdbFormat from './app/one-offs/esdb-format';
import parseGoogleLocationHistory from './app/one-offs/google-location-history-parser';

(async () => {
  // await esdbExport();
  // await esdbFormat();
  await parseGoogleLocationHistory();
  console.log('Done baby');
})();
