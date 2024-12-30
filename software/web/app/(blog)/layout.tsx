import React from 'react';
import Link from 'next/link';
import '@fontsource/silkscreen';
import '@lowlighter/matcha/dist/matcha.css';
import './blog.css';

import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { GoToTop } from '../../lib/GoToTop/GoToTop';

export default async function MatchaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <head>
        <title>Lane&apos;s Admin Site</title>
        {/* <link rel="stylesheet" href="https://unpkg.com/terminal.css@0.7.4/dist/terminal.min.css" /> */}
      </head>
      <body>
        <nav>
          <Link href="/" className={'default'}>
            <h2>Lane&apos;s Admin Site</h2>
          </Link>
        </nav>
        <nav style={{ flexWrap: 'wrap', gap: '5px' }}>
          <Link href="/feed">Feed</Link>
          <Link href="/admin">Admin</Link>
          <Link href="/recommend">Recommend</Link>
          <Link href={'/food'}>Food</Link>
          <Link href="/inbox">Inbox</Link>
        </nav>
        {children}
        <GoToTop />
        <footer>
          <div>
            <dl>
              <dd>
                <a
                  href="https://hub.docker.com/repository/docker/loonison101/web/tags"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    alt="docker image size"
                    src="https://img.shields.io/docker/image-size/loonison101/web"
                  />
                </a>
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
            </dl>
          </div>
          <div>
            <dl>
              <dd>©️ {new Date().getFullYear()} Lane Katris</dd>
              <dd>
                <Link href="/recommend">Recommend</Link>
              </dd>
              <dd>
                <Link href="/fitness">Fitness</Link>
                {' | '}
                <Link href="/goals">Goals</Link>
                {' | '}
                <Link href={'/food'}>Food</Link>
              </dd>
              <dd>{session && <Link href="/feed">Feed</Link>}</dd>
              <dd>
                <Link href="/colophon">Colophon</Link>
              </dd>
            </dl>
            <dd>
              {session && <Link href="/admin">Admin</Link>}
              {' | '}
              {session && <Link href="/inbox">Inbox</Link>}
            </dd>
            <dd>
              {session && (
                <Link href="/location-history">Location History</Link>
              )}
            </dd>
            <dd>{session && <Link href="/climb/gym-users">Gym Users</Link>}</dd>
            <dd>
              <Link href={session ? '/api/auth/signout' : '/api/auth/signin'}>
                {session ? 'Logout' : 'Login'}
              </Link>
            </dd>
          </div>
        </footer>
      </body>
    </html>
  );
}
