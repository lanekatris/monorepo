import ThemeRegistry from './ThemeRegistry';
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
import ThemeToggler from './ThemeToggler';

export const metadata = {
  title: `Lane's Site`,
  description: 'to do'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry options={{ key: 'joy' }}>
          <Container maxWidth="sm" sx={{ marginTop: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography level="h4">
                <Link
                  href="/"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Lane&apos;s Site
                </Link>
              </Typography>
              {/*<Link href="/feed">Feed</Link>*/}

              {/*<Stack direction="row" spacing={1}>*/}
              <Link href="/feed">Feed</Link>
              <Link href="/admin">Admin</Link>
              <Link href="/blog">Blog</Link>

              <Link href="/about">About</Link>

              <ThemeToggler />
              {/*</Stack>*/}
            </Stack>
            {/*<Divider />*/}
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

            <img
              style={{
                marginLeft: '.5em'
              }}
              src="https://api.netlify.com/api/v1/badges/6b9d6176-8a2c-44e4-9a44-27e96e5caa03/deploy-status"
              alt="Netlify Build Status"
            />
          </footer>
          <br />
        </ThemeRegistry>
      </body>
    </html>
  );
}
