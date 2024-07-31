import { Breadcrumbs, Container, Input, Link, Typography } from "@mui/joy";
import Fuse from "fuse.js";

import { sql } from "@vercel/postgres";

import bookmarks from "./raindrop-export.json";
import { Podcast } from "../spotify/page";
import SearchIdk from "./SearchIdk";
// const data = [
//   {
//     name: 'Darknet Diaries',
//     source: 'podcast',
//   },
//   {
//     name: 'Full Stack Radio',
//     source: 'podcast',
//   },
// ];

export interface SearchResult {
  name: string;
  source: string;
  url?: string;
}

async function getIndex() {
  const { rows: podcasts }: { rows: Podcast[] } =
    await sql`select name,publisher,replace(uri,'spotify:show:', 'https://open.spotify.com/show/') as url from spotify_podcasts order by name`;

  let data: SearchResult[] = podcasts.map((x) => ({
    name: x.name,
    source: "podcast",
    url: x.url,
  }));

  data = [
    ...data,
    ...bookmarks.map((x) => ({
      name: x.title + " - " + x.excerpt,
      url: x.url,
      source: "bookmark",
    })),
  ];

  const index = Fuse.createIndex(["name", "source"], data);

  return { index: index.toJSON(), data };
}

export default async function SearchPage() {
  const { index: indexJson, data } = await getIndex();
  // console.log('indexJson', indexJson);
  // const index = Fuse.parseIndex(indexJson);
  // const fuse = new Fuse(data, {}, index);
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Search</Typography>
      </Breadcrumbs>
      <Typography gutterBottom level="h3">
        Search
      </Typography>

      <SearchIdk data={data} index={indexJson} />
    </Container>
  );
}
