import React from 'react';
import { Container } from '@mui/joy';
import Link from 'next/link';
import '@lowlighter/matcha/dist/matcha.css';
import './blog.css';
import ThemeToggler from '../../ThemeToggler';

import { ThemeProvider } from 'next-themes';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    // <Container maxWidth="sm">
    <html lang="en">
      <head>
        <title>Lane's Blog</title>
        {/*<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />*/}
      </head>
      <body>
        <h2>Lane's Site</h2>

        {/*  Lane's Blog*/}
        {/*  <menu>*/}
        {/*    <li>Lane's Blog</li>*/}
        {/*    <li>Home</li>*/}
        {/*  </menu>*/}
        {/*  <ol></ol>*/}
        {/*</nav>*/}
        {/*<Link href="/">Home</Link>*/}
        {children}
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
      </body>
    </html>
  );
}
