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
import generateRssFeed from '../../../generateRssFeed';

export default async function BlogPage() {
  // await generateRssFeed();
  return (
    <>
      <main>
        {/*<div className="flash attention">*/}
        {/*  I know this styling is very different - it is intentional 😉 (*/}
        {/*  <a*/}
        {/*    href="https://matcha.mizu.sh/"*/}
        {/*    rel="noopener noreferrer"*/}
        {/*    target="_blank"*/}
        {/*  >*/}
        {/*    Matcha CSS*/}
        {/*  </a>*/}
        {/*  )*/}
        {/*</div>*/}
        <div className="flash accent">
          I write Twitter/X type of content{' '}
          <b>
            <Link href={'https://memo.lkat.io'}>here</Link>
          </b>
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
                  {/*<Link href={c.permalink}>{c.title}</Link>*/}
                  {/*<br />*/}
                  {/*<small>{c.date.split('T')[0]}</small>*/}
                  <span className={'mr-.75'}>{c.date.split('T')[0]}</span>
                  <Link href={c.permalink}>{c.title}</Link>
                  {/*<br />*/}
                  {/*<Link href={c.permalink}>*/}
                  {/*  <span className={'mr-.75'}>{c.date.split('T')[0]}</span>*/}
                  {/*  {c.title}*/}
                  {/*</Link>*/}
                </dd>
              ))}
          </dl>
        </div>
      </main>
    </>
  );
}
