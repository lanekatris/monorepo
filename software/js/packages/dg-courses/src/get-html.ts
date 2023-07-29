// const got = require('got');
// import got from 'got';
import axios from 'axios';

export async function getHtml(url: string) {
  const { data } = await axios.get(url);
  return data;
}
