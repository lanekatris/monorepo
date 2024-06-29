import { ObsidianApi } from './ObsidianApi';

const baseUrl = 'http://localhost:8080';
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
  return async function (obsidian: ObsidianApi) {
    // eslint-disable-next-line prefer-rest-params
    console.log(arguments);
    const url = `${baseUrl}/${type}`;
    new obsidian.obsidian.Notice(`Invoking ${type} with ${url}`);
    const result = await fetch(url, {
      // headers: {
      //   'CF-Access-Client-Id': process.env.CF_CLIENT_ID,
      //   'CF-Access-Client-Secret': process.env.CF_CLIENT_SECRET,
      // },
    });
    const text = await result.text();
    console.log(text);
    new obsidian.obsidian.Notice(`Done ${type}`);
  };
}
