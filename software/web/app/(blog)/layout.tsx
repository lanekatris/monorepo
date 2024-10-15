import React from 'react';
import { Container } from '@mui/joy';
import Link from 'next/link';
import '@fontsource/silkscreen';
import '@lowlighter/matcha/dist/matcha.css';
import './blog/blog.css';

import Image from 'next/image';
import NotAi from './blog/[slug]/Written-By-Human-Not-By-AI-Badge-white.svg';
import { getServerSession } from 'next-auth';
import { GoToTop } from '../../lib/GoToTop/GoToTop';

export default async function MatchaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
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
            {session && <Link href="/feed">Feed</Link>}{' '}
            {/*<Link href="/homelab">Homelab</Link>*/}
            <Link href={'/about'}>About</Link>
            <Link href="/blog" className={'selected'}>
              Blog
            </Link>
          </div>
        </nav>
        {/*<div>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href="/blog" className={'selected'}>*/}
        {/*    Blog*/}
        {/*  </Link>*/}

        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href="/blog" className={'selected'}>*/}
        {/*    Blog*/}
        {/*  </Link>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href="/blog" className={'selected'}>*/}
        {/*    Blog*/}
        {/*  </Link>*/}
        {/*</div>*/}
        {/*<nav>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*  <Link href={'/about'}>About</Link>*/}
        {/*</nav>*/}
        {children}
        <GoToTop />
        <footer>
          {/*<div*/}
          {/*  style={{ textAlign: 'center' }}*/}
          {/*  className="flex center align-center mb-1"*/}
          {/*>*/}
          {/*  <a*/}
          {/*    href="https://notbyai.fyi"*/}
          {/*    target="_blank"*/}
          {/*    rel="noopener noreferrer"*/}
          {/*    className="mr-2"*/}
          {/*  >*/}
          {/*    <Image src={NotAi} alt="Not written by AI" />*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*    href="https://github.com/lanekatris/monorepo/actions"*/}
          {/*    target="_blank"*/}
          {/*    className="mr-1"*/}
          {/*  >*/}
          {/*    <img*/}
          {/*      alt="docker image build status"*/}
          {/*      src="https://github.com/lanekatris/monorepo/actions/workflows/web-docker.yml/badge.svg"*/}
          {/*    />*/}
          {/*  </a>*/}
          {/*  <a*/}
          {/*    href="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml"*/}
          {/*    target="_blank"*/}
          {/*  >*/}
          {/*    <img*/}
          {/*      alt="Cron to rebuild climb.rest"*/}
          {/*      src="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml/badge.svg"*/}
          {/*    />*/}
          {/*  </a>*/}
          {/*</div>*/}
          <div>
            <dl>
              <dd>
                <a
                  href="https://notbyai.fyi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image priority={false} src={NotAi} alt="Not written by AI" />
                </a>
              </dd>
              <dd>
                <a
                  href="https://github.com/lanekatris/monorepo/actions"
                  target="_blank"
                >
                  <img
                    alt="docker image build status"
                    src="https://github.com/lanekatris/monorepo/actions/workflows/web-docker.yml/badge.svg"
                  />
                </a>
              </dd>
              <dd>
                <a
                  href="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml"
                  target="_blank"
                >
                  <img
                    alt="Cron to rebuild climb.rest"
                    src="https://github.com/lanekatris/monorepo/actions/workflows/climb-rest-build.yml/badge.svg"
                  />
                </a>
              </dd>
            </dl>
          </div>
          <div>
            <dl>
              <dd>©️ {new Date().getFullYear()} Lane Katris</dd>
              <dd>
                <Link href="/colophon">Colophon</Link>
              </dd>
              <dd>{session && <Link href="/feed">Feed</Link>}</dd>
              <dd>
                <Link href={'/homelab'}>Homelab</Link>
              </dd>
            </dl>
            <dd>{session && <Link href="/admin">Admin</Link>}</dd>
            <dd>{session && <Link href="/inbox">Inbox</Link>}</dd>
            <dd>
              {session && (
                <Link href="/location-history">Location History</Link>
              )}
            </dd>
            <dd>{session && <Link href="/climb/gym-users">Gym Users</Link>}</dd>
            <dd>
              <Link href={'/food'}>Food</Link>
            </dd>
            <dd>
              <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
                {session ? 'Logout' : 'Login'}
              </Link>
            </dd>
            {/*</li>*/}
            {/*</ul>*/}
          </div>
        </footer>
      </body>
    </html>
  );
}
