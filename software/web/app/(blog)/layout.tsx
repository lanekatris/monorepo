import React from 'react';
import Link from 'next/link';
import '@fontsource/silkscreen';
import '@lowlighter/matcha/dist/matcha.css';
import './blog.css';

import Image from 'next/image';
import { GoToTop } from '../../lib/GoToTop/GoToTop';

export default async function MatchaLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Lane&apos;s Blog</title>
      </head>
      <body>
        <nav>
          <Link href="/" className={'default'}>
            <h2>Lane&apos;s Site</h2>
          </Link>
          <div className={'links'}>
            <Link href="/feed">Feed</Link>
            <Link href={'/about'}>About</Link>
          </div>
        </nav>
        {children}
        <GoToTop />
        <footer>
          <div>
            <dl>
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
            </dl>
          </div>
          <div>
            <dl>
              <dd>©️ {new Date().getFullYear()} Lane Katris</dd>
              <dd>
                <Link href="/fitness">Fitness</Link>
                {' | '}
                <Link href="/goals">Goals</Link>
                {' | '}
                <Link href={'/food'}>Food</Link>
              </dd>
              <dd>
                <Link href="/feed">Feed</Link>
              </dd>
              <dd>
                <Link href="/colophon">Colophon</Link>
                {' | '}
                <Link href={'/homelab'}>Homelab</Link>
              </dd>
            </dl>
            <dd>
              <Link href="/admin">Admin</Link>
              {' | '}
              <Link href="/inbox">Inbox</Link>
            </dd>
            <dd>
              <Link href="/location-history">Location History</Link>
            </dd>
            <dd>
              {' '}
              <Link href="/climb/gym-users">Gym Users</Link>
            </dd>
          </div>
        </footer>
      </body>
    </html>
  );
}
