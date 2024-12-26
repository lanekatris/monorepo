import { Chip, List, ListItem, useTheme } from '@mui/joy';
import Link from 'next/link';
import React from 'react';
import { getServerSession } from 'next-auth';
import { FiExternalLink } from 'react-icons/fi';

import { NotAuthorized } from './(blog)/feed/notAuthorized';

const links = [
  {
    href: 'https://memo.lkat.io/',
    name: 'Notes',
    icon: <FiExternalLink />,
    target: '_blank'
  },
  { href: '/goals', name: 'Goals' },
  { href: '/blogroll', name: 'Blog Roll' },
  // { href: '/location-history', name: 'Location History', requiresLogin: true },
  // { href: '/discs', name: 'Disc Golf' },
  // { href: '/climb/gym-users', name: 'Gym Users', requiresLogin: true },
  // { href: '/fitness', name: 'Fitness' },
  { href: '/spotify', name: 'Spotify' }
  // { href: '/search', name: 'Search', requiresLogin: true }
];

export default async function HomeLinks() {
  // const session = await getServerSession();
  return (
    <List size="sm" sx={{ backgroundColor: '#ffffce' }}>
      {links
        // .filter((link) => {
        //   if (!link.requiresLogin) return true;
        //   return session;
        // })
        .map(({ href, name }) => {
          return (
            <ListItem key={name}>
              <Link href={href}>{name}</Link>
            </ListItem>
          );
        })}
    </List>
  );
}

export async function HomeLinksV2() {
  // const session = await getServerSession();
  return (
    <ul>
      {links
        // .filter((link) => {
        //   // if (!link.requiresLogin) return true;
        //   return session;
        // })
        .map(({ href, name, icon, target }) => {
          return (
            <li key={name}>
              <Link href={href} target={target}>
                {name} {icon}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
