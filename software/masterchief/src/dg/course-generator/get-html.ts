// const got = require('got');
// import got from 'got';
import axios from 'axios';

export async function getHtml(url: string) {
  // const { body } = await got(url);
  const result = await axios.get(url);
  // return body;
  return result.data;
}
