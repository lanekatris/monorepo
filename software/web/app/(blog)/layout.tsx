import React from 'react';
import { Container } from '@mui/joy';
import Link from 'next/link';
import '@lowlighter/matcha/dist/matcha.css';
import './blog/blog.css';
import ThemeToggler from '../ThemeToggler';

import Image from 'next/image';
import NotAi from './blog/[slug]/Written-By-Human-Not-By-AI-Badge-white.svg';

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    // <Container maxWidth="sm">
    <html lang="en">
      <head>
        <title>Lane's Blog</title>
        {/*<link rel="stylesheet" href="https://matcha.mizu.sh/matcha.css" />*/}
      </head>
      <body>
        <nav>
          <Link href="/" className={'default'}>
            <h2>Lane's Site</h2>
          </Link>
          <div className={'links'}>
            <Link href="/colophon">Colophon</Link>
            <Link href={'/about'}>About</Link>
            <Link href="/blog" className={'selected'}>
              Blog
            </Link>
          </div>
        </nav>
        {children}
        <footer
          style={{ textAlign: 'center' }}
          className="flex center align-center mb-1"
        >
          <a
            href="https://notbyai.fyi"
            target="_blank"
            rel="noopener noreferrer"
            className="mr-2"
          >
            <Image src={NotAi} alt="Not written by AI" />
          </a>
          <a
            href="https://github.com/lanekatris/monorepo/actions"
            target="_blank"
            className="mr-1"
          >
            <img
              alt="docker image build status"
              src="https://github.com/lanekatris/monorepo/actions/workflows/web-docker.yml/badge.svg"
            />
          </a>
          <a
            href="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml"
            target="_blank"
          >
            <img
              alt="Cron to rebuild climb.rest"
              src="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml/badge.svg"
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
