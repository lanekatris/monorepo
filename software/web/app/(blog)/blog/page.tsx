import Link from 'next/link';
import {
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography
} from '@mui/joy';
import { posts } from '../../../.velite';
import React from 'react';

export default function BlogPage() {
  return (
    <>
      <nav>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
        </ol>
      </nav>
      <main>
        <div className="flash attention">
          I know this styling is very different - it is intentional 😉 (
          <a
            href="https://matcha.mizu.sh/"
            rel="noopener noreferrer"
            target="_blank"
          >
            Matcha CSS
          </a>
          )
        </div>
        <div className="flash default">
          <dl>
            {posts
              .filter((p) => p.draft !== true)
              .sort((a, b) => {
                return new Date(b.date).valueOf() - new Date(a.date).valueOf();
              })
              .map((c) => (
                <dd key={c.slug}>
                  <Link href={c.permalink}>{c.title}</Link>
                  <br />
                  <small>{c.date.split('T')[0]}</small>
                </dd>
              ))}
          </dl>
        </div>
      </main>
    </>
  );
}
