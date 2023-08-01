import { ObsidianApi } from './ObsidianApi';

const baseUrl = 'https://linux.loonison.com';
type LkatApiCall =
  | 'disable-monitors'
  | 'enable-monitors'
  | 'sleep'
  | 'disc-list'
  | 'recent-gym-users'
  | 'raindrop-io'
  | 'deploy-obsidian-client'
  | 'udisc-scorecards';
export function createGenericLkatApiCall(type: LkatApiCall) {
  return async function ({ obsidian }: { obsidian: ObsidianApi }) {
    const url = `${baseUrl}/${type}`;
    new obsidian.Notice(`Invoking ${type} with ${url}`);
    const result = await fetch(url, {
      headers: {
        'CF-Access-Client-Id': process.env.CF_CLIENT_ID,
        'CF-Access-Client-Secret': process.env.CF_CLIENT_SECRET,
      },
    });
    const text = await result.text();
    console.log(text);
    new obsidian.Notice(`Done ${type}`);
  };
}
