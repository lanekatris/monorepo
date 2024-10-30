import React from 'react';
import Link from 'next/link';
import '@fontsource/silkscreen';
import '@lowlighter/matcha/dist/matcha.css';
import './blog/blog.css';

import Image from 'next/image';
import NotAi from './blog/[slug]/Written-By-Human-Not-By-AI-Badge-white.svg';
import NotAiDark from './blog/[slug]/Written-By-Human-Not-By-AI-Badge-black.svg';
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
        <title>Lane&apos;s Blog</title>
      </head>
      <body>
        <nav>
          <Link href="/" className={'default'}>
            <h2>Lane&apos;s Site</h2>
          </Link>
          <div className={'links'}>
            {session && <Link href="/feed">Feed</Link>}{' '}
            <Link href={'/about'}>About</Link>
            <Link href="/blog" className={'selected'}>
              Blog
            </Link>
          </div>
        </nav>
        {children}
        <GoToTop />
        <footer>
          <div>
            <dl>
              <dd>
                <a
                  href="https://notbyai.fyi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <picture>
                    <source
                      srcSet={NotAiDark.src}
                      media="(prefers-color-scheme: dark)"
                    />
                    <Image
                      priority={false}
                      src={NotAi}
                      alt="Not written by AI"
                    />
                  </picture>
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
              <dd>{session && <Link href="/feed">Feed</Link>}</dd>
              <dd>
                <Link href="/colophon">Colophon</Link>
                {' | '}
                <Link href={'/homelab'}>Homelab</Link>
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
