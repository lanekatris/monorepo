'use client';
import { Chip, List, ListItem, useTheme } from '@mui/joy';
import Link from 'next/link';

export default function HomeLinks() {
  return (
    <List
      size="sm"
      sx={{ backgroundColor: '#ffffce' }}
      // sx={(theme) => {}}
      // sx={{ backgroundColor: theme.palette.warning.solidBg }}
    >
      <ListItem>
        <Link href="/location-history">Location History</Link>

        <Chip variant="outlined" color="warning">
          Requires Login
        </Chip>
      </ListItem>
      <ListItem>
        <Link href="/discs">Disc Golf</Link>
      </ListItem>
      <ListItem>
        <Link href="/climb/logger">Climb Logger</Link>

        <Chip variant="outlined" color="warning">
          Requires Login
        </Chip>
      </ListItem>
      <ListItem>
        <Link href="/climb/gym-users">Gym Users</Link>{' '}
        <Chip variant="outlined" color="warning">
          Requires Login
        </Chip>
      </ListItem>
      <ListItem>
        <Link href="/fitness">Fitness</Link>
      </ListItem>
      <ListItem>
        <Link href="/spotify">Spotify & My Podcasts</Link>
      </ListItem>
      <ListItem>
        <Link href="/search">Search</Link>
      </ListItem>
      {/*<ListItem>*/}
      {/*  <Link href="/blog">Blog </Link>*/}
      {/*  <Chip color="warning" variant="soft">*/}
      {/*    WIP*/}
      {/*  </Chip>*/}
      {/*</ListItem>*/}
    </List>
  );
}
