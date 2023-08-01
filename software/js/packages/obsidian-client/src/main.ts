import { ObsidianApi } from './ObsidianApi';
import { createEventFile } from './createEventFile';
import { createGenericLkatApiCall } from './createGenericLkatApiCall';

export async function syncInbox({ obsidian }) {
  new obsidian.Notice(`Syncing inbox...`);

  await fetch(
    'http://localhost:5678/webhook/34027c90-9b75-4a50-b981-7d1f35ee5d1d'
  );

  new obsidian.Notice(`Done syncing`);
}

export const climbedToday = createEventFile('indoor-climbing');
export const discGolfedToday = createEventFile('disc-golf');
export const volleyballToday = createEventFile('volleyball');
export const disableMonitors = createGenericLkatApiCall('disable-monitors');
export const enableMonitors = createGenericLkatApiCall('enable-monitors');
export const sleep = createGenericLkatApiCall('sleep');
export const discList = createGenericLkatApiCall('disc-list');
export const recentGymUsers = createGenericLkatApiCall('recent-gym-users');
export const raindropIo = createGenericLkatApiCall('raindrop-io');
export const deployObsidianClient = createGenericLkatApiCall(
  'deploy-obsidian-client'
);
export const udiscScorecards = createGenericLkatApiCall('udisc-scorecards');

export async function refreshAll(props: ObsidianApi) {
  new props.Notice(`Refreshing all.`);

  await Promise.all([
    discList(props),
    recentGymUsers(props),
    raindropIo(props),
    udiscScorecards(props),
    deployObsidianClient(props),
  ]);

  new props.Notice(`Done refreshing all.`);
}
