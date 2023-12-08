import fs from 'fs/promises';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';

const client = new EventStoreDBClient(
  {
    endpoint: 'localhost:2113',
  },
  { insecure: true }
);

export async function findStagedFiles() {
  // Read files
  const allFiles = await fs.readdir('F:\\climb-recorder-poc-v1');
  const files = allFiles.filter((x) => x.includes('.mkv'));

  console.log(files);

  // const event = jsonEvent({
  //   type: 'test1',
  //   data: {
  //     hello: 'there',
  //   },
  // });
  //
  // const events = files.add
  //
  // const appendResult = await client.appendToStream('RawFiles', [event]);
  // console.log(appendResult);

  // Fire off temporal to process each file
  // 1 - parse the filename, does it NOT exist in eventstore (maybe this would be a stream?)
  // 2 - write to event store
  // 3 - move the file to a different folder
}
