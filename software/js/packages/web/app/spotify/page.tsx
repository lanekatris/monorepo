import {
  Breadcrumbs,
  CardContent,
  Container,
  Stack,
  Link,
  Typography,
  Grid,
  Card,
  Sheet,
  Table,
  Chip,
  Alert,
} from '@mui/joy';
import { sql } from '@vercel/postgres';

interface TotalListening {
  total_milliseconds: string;
  start_date: string;
  end_date: string;
}

interface PodcastTotal {
  is_podcast: boolean;
  hours: string;
}

interface TopTrack {
  artist: string;
  trackname: string;
  minutes: string;
}

interface Podcast {
  name: string;
  publisher: string;

  url: string;
}

export default async function SpotifyPage() {
  const { rows: rowsa }: { rows: TotalListening[] } =
    await sql`select sum(msplayed) total_milliseconds, min(endtime) start_date,max(endtime) end_date from spotify_streaming_history`;

  const { rows }: { rows: PodcastTotal[] } =
    await sql`select is_podcast, sum(msplayed)  / 3600000 as hours from vw_spotify_history_v2 group by is_podcast`;

  const { rows: rows3 }: { rows: TopTrack[] } =
    await sql`select max(artistname) as artist, trackname,sum(msplayed) / 60000 as minutes from vw_spotify_history_v2 where is_podcast = false group by trackname order by sum(msplayed) desc limit 5`;

  const { rows: podcasts }: { rows: Podcast[] } =
    await sql`select name,publisher,replace(uri,'spotify:show:', 'https://open.spotify.com/show/') as url from spotify_podcasts order by name`;

  const total = rowsa[0];
  const podcastTotal = rows.find((x) => x.is_podcast);
  const nonPodcastTotal = rows.find((x) => !x.is_podcast);

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Spotify Data</Typography>
      </Breadcrumbs>

      <Typography level={'h2'} gutterBottom>
        Spotify Data
      </Typography>

      <Link
        target="_blank"
        href="https://www.lanekatris.com/Consuming-Spotify-Data"
      >
        How this page was made
      </Link>
      <br />
      <Link
        target="_blank"
        href="https://github.com/lanekatris/monorepo/blob/main/software/js/packages/web/app/spotify/page.tsx"
      >
        Source Code and SQL Queries
      </Link>
      <br />
      <br />
      <Typography level={'h4'}>Stats</Typography>
      <Grid container spacing={2}>
        <Grid xs={12} md={6}>
          <Sheet>
            <Card>
              <CardContent>
                <Typography level={'body-md'}>Total Listen Time</Typography>
                <Typography level="h2">
                  {Math.round(parseInt(total.total_milliseconds) / 3600000)}{' '}
                  Hours
                </Typography>
                <Typography level={'body-xs'}>
                  {total.start_date.split(' ')[0]} -{' '}
                  {total.end_date.split(' ')[0]}
                </Typography>
              </CardContent>
            </Card>
          </Sheet>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level={'body-md'}>Total Podcast Time</Typography>
              <Typography level="h2">{podcastTotal?.hours} Hours</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography level={'body-md'}>Total Music Time</Typography>
              <Typography level="h2">{nonPodcastTotal?.hours} Hours</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <br />
      <br />

      <Typography level={'h4'}>Top 5 Listened to Songs</Typography>
      <Alert color={'warning'} size={'sm'}>
        No link to the song is given in the export
      </Alert>
      <Table stripe={'odd'}>
        <thead>
          <tr>
            <th>Artist</th>
            <th>Track</th>
            <th>Minutes</th>
          </tr>
        </thead>
        <tbody>
          {rows3.map(({ artist, trackname, minutes }) => (
            <tr key={`${artist}-${trackname}`}>
              <td>{artist}</td>
              <td>{trackname}</td>
              <td>{minutes}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <br />
      <br />

      <Typography level={'h4'}>
        My Podcasts{' '}
        <Chip color={'primary'} size={'sm'}>
          {podcasts.length}
        </Chip>
      </Typography>
      <Typography level={'body-sm'}>Ordered by podcast name</Typography>
      <Table stripe={'odd'}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {podcasts.map(({ name, publisher, url }) => (
            <tr key={url}>
              <td>
                <Link target={'_blank'} href={url}>
                  {name}
                </Link>
              </td>
              <td>{publisher}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <br />
    </Container>
  );
}
