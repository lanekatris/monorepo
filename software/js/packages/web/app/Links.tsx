'use client';
import { Chip, List, ListItem, useTheme } from '@mui/joy';
import Link from 'next/link';
import { isAdmin } from 'packages/web/isAdmin';

const links = [
  // { href: '/admin', name: 'Admin', admin: true },
  // { href: '/feed', name: 'Feed' },
  { href: '/location-history', name: 'Location History', admin: true },
  { href: '/discs', name: 'Disc Golf' },
  { href: '/climb/logger', name: 'Climb Logger', admin: true },
  { href: '/climb/gym-users', name: 'Gym Users', admin: true },
  { href: '/fitness', name: 'Fitness' },
  { href: '/spotify', name: 'Spotify' },
  { href: '/search', name: 'Search' },
];

export default function HomeLinks() {
  return (
    <List
      size="sm"
      sx={{ backgroundColor: '#ffffce' }}
      // sx={(theme) => {}}
      // sx={{ backgroundColor: theme.palette.warning.solidBg }}
    >
      {links.map(({ href, name, admin }) => {
        if (!admin) {
          return (
            <ListItem key={name}>
              <Link href={href}>{name}</Link>
            </ListItem>
          );
        }
        if (isAdmin())
          return (
            <ListItem key={name}>
              <Link href={href}>{name}</Link>
            </ListItem>
          );

        return null;
      })}
      {/*{showAdminLink && (*/}
      {/*  <ListItem>*/}
      {/*    <Link href="/admin">Admin</Link>*/}
      {/*  </ListItem>*/}
      {/*)}*/}
      {/*<ListItem>*/}
      {/*  <Link href="/feed">Feed</Link>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/location-history">Location History</Link>*/}
      {/*  <Chip variant="outlined" color="warning">*/}
      {/*    Requires Login*/}
      {/*  </Chip>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/discs">Disc Golf</Link>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/climb/logger">Climb Logger</Link>*/}

      {/*  <Chip variant="outlined" color="warning">*/}
      {/*    Requires Login*/}
      {/*  </Chip>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/climb/gym-users">Gym Users</Link>{' '}*/}
      {/*  <Chip variant="outlined" color="warning">*/}
      {/*    Requires Login*/}
      {/*  </Chip>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/fitness">Fitness</Link>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/spotify">Spotify & My Podcasts</Link>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/search">Search</Link>*/}
      {/*</ListItem>*/}
      {/*<ListItem>*/}
      {/*  <Link href="/blog">Blog </Link>*/}
      {/*  <Chip color="warning" variant="soft">*/}
      {/*    WIP*/}
      {/*  </Chip>*/}
      {/*</ListItem>*/}
    </List>
  );
}
