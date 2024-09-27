import { getFeed } from '../../../feed/get-feed';
import {
  feedIcon,
  FeedLineItemProps,
  feedTitle,
  USDollar
} from '../../(mui-theme)/FeedTable';
import React from 'react';
import NextLink from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession } from 'next-auth';
import Markdown from 'react-markdown';
import { NotAuthorized } from './notAuthorized';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: {
    showBookmarks?: 'true' | 'false';
  };
}

function FeedLineItemV2({ type, date, children, link }: FeedLineItemProps) {
  return (
    <div
      // className={'flash default'}
      className={''}
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        borderBottom: '1px solid #00000038',
        marginBottom: '1rem'
      }}
    >
      {feedIcon[type]}
      <div>
        <div
          style={{
            display: 'flex',
            gap: '.25rem',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
          className={'smaller'}
        >
          <div>{date?.toLocaleDateString()}</div>
          <div>|</div>
          <div>{feedTitle[type]}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  noStore();
  const feedFilter = {
    showBookmarks: searchParams.showBookmarks !== 'false'
  };

  const feed = await getFeed(feedFilter);

  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  return (
    <main>
      Feed ({feed.length}) :: <Link href="/feed.json">API</Link> ::{' '}
      <NextLink href="/admin">Refresh Feed...</NextLink>
      <NextLink
        href={`/feed?showBookmarks=${
          feedFilter.showBookmarks ? 'false' : 'true'
        }`}
      >
        {feedFilter.showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}
      </NextLink>
      <h1>Feed</h1>
      {feed.map(({ id, type, date, data }) => {
        if (type === 'obsidian-adventure' && data.adventure)
          return (
            <>
              <FeedLineItemV2 type={type} date={date}>
                <small
                  className={'smaller'}
                  style={{ display: 'flex', gap: '.25rem' }}
                >
                  <div>{data.adventure.activity}</div>
                  <div>|</div>
                  <NextLink
                    href={`obsidian://open?vault=vault1&file=${encodeURIComponent(
                      data.adventure.path.replace(
                        `C:\\Users\\looni\\vault1\\`,
                        ''
                      )
                    )}`}
                  >
                    Link
                  </NextLink>
                </small>
                <blockquote>
                  {/*<b>Notes:</b>*/}
                  {data.adventure.contents?.trim() ? (
                    <Markdown>{data.adventure.contents}</Markdown>
                  ) : (
                    'No Notes'
                  )}
                </blockquote>
              </FeedLineItemV2>
            </>
          );

        if (type === 'memo')
          return (
            <>
              <FeedLineItemV2 type={type} date={date}>
                <blockquote>
                  <Markdown>{data.memo?.content}</Markdown>
                </blockquote>
                {data.memo?.resources?.map((rl, i) => (
                  <a
                    href={`https://memo.lkat.io/m/${data.memo?.uid}`}
                    target={'_blank'}
                    key={`${data.memo?.uid}-${rl.filename}-${i}`}
                  >
                    <img
                      height={100}
                      // width={100}
                      alt={rl.filename}
                      src={`https://memo.lkat.io/file/${rl.name}/${rl.filename}`}
                    />
                  </a>
                ))}
              </FeedLineItemV2>
            </>
          );

        if (type === 'maintenance')
          return (
            <>
              <FeedLineItemV2 type={type} date={date}>
                <div>
                  {data.maintenance?.title}
                  <div>{data.maintenance?.Property}</div>
                  <blockquote>
                    <Markdown>{data.maintenance?.Notes}</Markdown>
                  </blockquote>
                </div>
              </FeedLineItemV2>
            </>
          );

        if (type === 'purchase')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              <div>
                <b>{data.purchase?.title}</b> <div>{data.purchase?.Tags}</div>
                <div>{USDollar.format(data.purchase?.Cost ?? 0)}</div>
                <blockquote>
                  <Markdown>{data.purchase?.Notes}</Markdown>
                </blockquote>
              </div>
            </FeedLineItemV2>
          );

        if (type === 'disc-golf-scorecard')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              @ {data.scorecard?.coursename} ({data.scorecard?.['+/-']})
            </FeedLineItemV2>
          );

        if (type === 'disc-golf-disc')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              #{data.disc?.number} - {data.disc?.brand} {data.disc?.plastic}{' '}
              {data.disc?.model}{' '}
              {data.disc?.weight && `(${data.disc?.weight}g)`}
            </FeedLineItemV2>
          );

        if (type === 'climb')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              {data.climb?.Route} ({data.climb?.Rating})
              <blockquote>{data.climb?.Notes}</blockquote>
            </FeedLineItemV2>
          );

        if (type === 'raindrop' && data.raindrop)
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              <Link href={data.raindrop.link} target="_blank">
                {data.raindrop?.title?.substring(0, 100)}...
              </Link>
              <br />
              {/*<div>{data.raindrop?.excerpt}</div>*/}
              {data.raindrop?.excerpt && (
                <details>
                  <summary>{data.raindrop?.excerpt?.substring(0, 100)}</summary>
                  {data.raindrop?.excerpt}
                </details>
              )}
              {data.raindrop?.note && (
                <blockquote>{data.raindrop?.note}</blockquote>
              )}
            </FeedLineItemV2>
          );

        return <div key={id}>{type} - not implemented</div>;
      })}
    </main>
  );
}
