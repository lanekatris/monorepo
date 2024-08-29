import { Chip, List, ListItem, useTheme } from '@mui/joy';
import Link from 'next/link';
import React from 'react';
import { getServerSession } from 'next-auth';
import { NotAuthorized } from './feed/page';

const links = [
  { href: '/blogroll', name: 'Blog Roll' },
  { href: 'https://memo.lkat.io/', name: 'Notes' },
  { href: '/location-history', name: 'Location History', requiresLogin: true },
  { href: '/discs', name: 'Disc Golf' },
  { href: '/climb/gym-users', name: 'Gym Users', requiresLogin: true },
  { href: '/fitness', name: 'Fitness' },
  { href: '/spotify', name: 'Spotify' },
  { href: '/search', name: 'Search', requiresLogin: true }
];

export default async function HomeLinks() {
  const session = await getServerSession();
  return (
    <List
      size="sm"
      sx={{ backgroundColor: '#ffffce' }}
      // sx={(theme) => {}}
      // sx={{ backgroundColor: theme.palette.warning.solidBg }}
    >
      {links
        .filter((link) => {
          if (!link.requiresLogin) return true;
          return session;
        })
        .map(({ href, name }) => {
          return (
            <ListItem key={name}>
              <Link href={href}>{name}</Link>
            </ListItem>
          );
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
