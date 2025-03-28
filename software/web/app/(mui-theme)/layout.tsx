import ThemeRegistry from '../ThemeRegistry';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  getInitColorSchemeScript,
  Stack,
  Typography
} from '@mui/joy';
import React from 'react';
import Link from 'next/link';
import ThemeToggler from '../ThemeToggler';
import { getServerSession } from 'next-auth';
import ExampleCommandPalette from './CommandPalette';
import { Toaster } from 'react-hot-toast';
import { restartWebserverServerFunction } from '../../lib/restartWebserver';

export const metadata = {
  title: `Lane's Site`,
  description: 'to do'
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  // async function restartWeb() {
  //   'use server';
  //   const session = await getServerSession();
  //   console.log('server session', session);
  // }
  return (
    <html lang="en">
      <body>
        <Toaster />
        <ThemeRegistry options={{ key: 'joy' }}>
          <Container sx={{ marginTop: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography level="h4">
                <Link
                  href="/"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Lane&apos;s Site
                </Link>
              </Typography>
              {session && <Link href="/feed">Feed</Link>}
              {session && <Link href="/admin">Admin</Link>}
              <Link href="/blog">Blog</Link>
              <Link href="/about">About</Link>
              {session && <Link href="/inbox">Inbox</Link>}
              <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
                {session ? 'Logout' : 'Login'}
              </Link>

              <ThemeToggler />
            </Stack>
          </Container>
          {children}
          <br />
          <footer style={{ textAlign: 'center' }}>
            <a
              href="https://github.com/lanekatris/monorepo/actions"
              target="_blank"
            >
              <img
                alt="docker image build status"
                src="https://github.com/lanekatris/monorepo/actions/workflows/web-docker.yml/badge.svg"
              />
            </a>
          </footer>
          <br />
        </ThemeRegistry>
        {session && (
          <ExampleCommandPalette restartWeb={restartWebserverServerFunction} />
        )}
      </body>
    </html>
  );
}
