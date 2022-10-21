// import { masterChiefClient } from '@js/shared';

// The architecture of getting data has to be self hosted with nestjs or whatever
// because we have to VPC pair with esdb hosting

// so unfortunately we need two sites, or we run nextjs from wherever...

export default async function handler(req, res) {
  // const movies = await masterChiefClient.moviesQueryMan();
  res.status(200).json('fix me');
}

//
// export default async function handler(req, res) {
//   const idk = await masterChiefClient.idk();
//
//   res.status(200).json(idk);
// }
