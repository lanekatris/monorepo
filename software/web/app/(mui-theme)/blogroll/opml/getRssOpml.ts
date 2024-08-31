import axios from 'axios';

export async function getRssOpml() {
  const { data: xml } = await axios.get<string>(
    'http://192.168.86.100:8663/v1/export',
    {
      headers: {
        'X-Auth-Token': process.env.MINIFLUX_API_KEY
      }
    }
  );
  return xml;
}
