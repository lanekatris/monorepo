import { getServerSession } from 'next-auth';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function restartWebserver() {
  return exec(
    `docker run --rm -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once web`
  );
}

export async function restartWebserverServerFunction() {
  'use server';
  const session = await getServerSession();
  if (!session) {
    console.log('not logged in, not doing anything');
    return;
  }
  return restartWebserver();
}
