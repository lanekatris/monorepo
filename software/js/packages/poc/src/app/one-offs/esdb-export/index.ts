import { getNextAndPersist } from './getNextAndPersist';

export default async function esdbExport() {
  let nextUrl: string | undefined = 'http://100.120.122.119:32417/streams/$all';
  while (nextUrl) {
    nextUrl = await getNextAndPersist(nextUrl);
  }
}
