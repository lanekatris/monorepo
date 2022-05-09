import { masterChiefClient } from '@js/shared';

export default async function handler(req, res) {
  const idk = await masterChiefClient.events();

  res.status(200).json(idk);
}
