import axios from 'axios';
const fs = require('fs');

export async function getNextAndPersist(url: string): Promise<string> {
  const formattedUrl = `${url}?embed=body`;
  console.log(`Querying ${formattedUrl}`);

  const response = await axios.get(formattedUrl, {
    headers: {
      Accept: 'application/vnd.eventstore.atom+json',
    },
  });
  fs.writeFileSync(
    `data/${encodeURIComponent(url)}.json`,
    JSON.stringify(response.data, null, 2)
  );

  return response.data.links.find((x) => x.relation === 'next')?.uri;
}
