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
import Markdown from 'react-markdown';
import { NotAuthorized } from './notAuthorized';
import Link from 'next/link';
import { FeedItem, FeedItemType } from '../../../feed/feed-types';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface FeedPageProps {
  searchParams: {
    showBookmarks?: 'true' | 'false';
  };
}

function FeedLineItemV2({
  type,
  date,
  children,
  link,
  className
}: FeedLineItemProps) {
  return (
    <div
      // className={'flash default'}
      // className={'flash attention'}
      className={className ?? 'flash default'}
      // className={''}
      style={{
        // display: 'flex',
        // gap: '1rem',
        // alignItems: 'center',
        marginBottom: '1rem',
        paddingBottom: 0
      }}
    >
      {/*{feedIcon[type]}*/}
      <div>
        <div
          style={{
            display: 'flex',
            gap: '.25rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between'
          }}
          className={'smaller'}
        >
          <div className={'flex'} style={{ gap: '.25rem' }}>
            {feedIcon[type]}
            <div className="bg-accent">{feedTitle[type]}</div>
          </div>
          {/*<div className="muted">|</div>*/}
          <div className="muted bg-muted">{date?.toLocaleDateString()}</div>
        </div>
        {children}
      </div>
    </div>
  );
}

function formatTitle(input: string): string {
  // {data.raindrop?.title?.split(' ').slice(0, 10).join(' ')}...

  const parts = input.split(' ');
  if (parts.length === 1) {
    return parts[0].slice(0, 30);
  }
  return parts.slice(0, 10).join(' ');
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  noStore();
  const feedFilter = {
    showBookmarks: searchParams.showBookmarks !== 'false'
  };

  const feed = await getFeed(feedFilter);

  return (
    <main>
      {/*Feed ({feed.length}) :: <Link href="/feed.json">API</Link> ::{' '}*/}
      {/*<NextLink href="/admin">Refresh Feed...</NextLink>*/}
      {/*<NextLink*/}
      {/*  href={`/feed?showBookmarks=${*/}
      {/*    feedFilter.showBookmarks ? 'false' : 'true'*/}
      {/*  }`}*/}
      {/*>*/}
      {/*  {feedFilter.showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}*/}
      {/*</NextLink>*/}
      {/*<h1>Feed ({feed.length}</h1>*/}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}
      >
        <h1 style={{ marginTop: 0 }}>Feed ({feed.length})</h1>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <Link href={'/inbox'} className={'muted'}>
            Inbox
          </Link>
          <span>|</span>
          <Link href="/feed.json" className={'active'}>
            API
          </Link>
          <span>|</span>
          <NextLink
            href={`/feed?showBookmarks=${
              feedFilter.showBookmarks ? 'false' : 'true'
            }`}
            className={'variant'}
          >
            {feedFilter.showBookmarks ? 'Hide Bookmarks' : 'Show Bookmarks'}
          </NextLink>
        </div>
      </div>
      {feed.map((input) => {
        const { id, type, date, data } = input;
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
                <blockquote className={'small'}>
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
                <blockquote className={'small'}>
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

        if (type === 'maintenance' && data.maintenance)
          return (
            <>
              <FeedLineItemV2 type={type} date={date}>
                <div className={'small'}>
                  <b>{data.maintenance?.title}</b>{' '}
                  {editLinks[type] ? (
                    <Link
                      href={`${editLinks[type]}${data.maintenance.id}`}
                      target={'_blank'}
                    >
                      Edit
                    </Link>
                  ) : (
                    ''
                  )}
                  <br />
                  <div className={'bg-variant'} style={{ display: 'inline' }}>
                    {data.maintenance?.Property}
                  </div>
                  {data.maintenance?.Notes && (
                    <blockquote>
                      <Markdown>{data.maintenance?.Notes}</Markdown>
                    </blockquote>
                  )}
                </div>
              </FeedLineItemV2>
            </>
          );

        if (type === 'purchase')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              {/*<div>*/}
              {/*  <b>{data.purchase?.title}</b>*/}
              {/*  <div>{data.purchase?.Tags}</div>*/}
              {/*  <div>{USDollar.format(data.purchase?.Cost ?? 0)}</div>*/}
              {/*  {data.purchase?.Notes && (*/}
              {/*    <blockquote>*/}
              {/*      <Markdown>{data.purchase?.Notes}</Markdown>*/}
              {/*    </blockquote>*/}
              {/*  )}*/}
              {/*</div>*/}

              {/*<hr />*/}
              <b className={'small'}>{data.purchase?.title}</b>
              <div
                className={'flex small'}
                style={{ gap: '1rem', marginBottom: '.5rem' }}
              >
                <div className={'bg-variant'}>{data.purchase?.Tags}</div>
                <div className={'bg-success'}>
                  {USDollar.format(data.purchase?.Cost ?? 0)}
                </div>
                {/*<br />*/}
                {/*<br />*/}
              </div>
              {data.purchase?.Notes && (
                <blockquote className={'small'}>
                  <Markdown>{data.purchase?.Notes}</Markdown>
                </blockquote>
              )}
            </FeedLineItemV2>
          );

        if (type === 'disc-golf-scorecard')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              <div className={'small'}>
                @ {data.scorecard?.coursename}
                <div className="small bg-variant" style={{ width: '2rem' }}>
                  {data.scorecard?.['+/-']}
                </div>
              </div>
            </FeedLineItemV2>
          );

        if (type === 'disc-golf-disc')
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              <div className="small">
                #{data.disc?.number} - {data.disc?.brand} {data.disc?.plastic}{' '}
                {data.disc?.model}{' '}
                {data.disc?.weight && `(${data.disc?.weight}g)`}
              </div>
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
          return <RaindropFeedItem key={id} input={input} />;
        if (type === 'github-event' && data.githubEvent)
          return (
            <FeedLineItemV2 key={id} type={type} date={date}>
              {(data.githubEvent.action === 'completed' ||
                data.githubEvent.action === 'in_progress') && (
                <>
                  GitHub Workflow: <code>{data.githubEvent.action}</code>
                  <blockquote className={'small'}>
                    {data.githubEvent.workflow_run?.display_title}
                  </blockquote>
                </>
              )}
              {data.githubEvent.commits && (
                <>
                  <div>Pushed</div>
                  <div>
                    {data.githubEvent.commits.map((commit) => (
                      <div key={commit.id}>
                        <small>{commit.message}</small>{' '}
                        <small>
                          <Link href={commit.url} target={'_blank'}>
                            Link
                          </Link>{' '}
                        </small>
                        <ul>
                          {commit.modified.map((file) => (
                            <li key={commit.id + file}>
                              <code>{file}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </FeedLineItemV2>
          );

        if (type === 'place-visit' && data.placeVisit)
          return (
            <FeedLineItemV2
              key={id}
              type={type}
              date={date}
              className={'flash success'}
            >
              Place: {data.placeVisit.name}
            </FeedLineItemV2>
          );
        return <div key={id}>{type} - not implemented</div>;
      })}
    </main>
  );
}

const editLinks: { [k in FeedItemType]: string | undefined } = {
  'disc-golf-scorecard': undefined,
  climb: undefined,
  'disc-golf-disc': undefined,
  'obsidian-adventure': undefined,
  memo: undefined,
  maintenance:
    'https://noco.lkat.io/dashboard/#/nc/p_egch5370h5zwqh/myqm1xxv25h0zia?rowId=',
  raindrop: undefined,
  purchase: undefined,
  'github-event': undefined,
  'place-visit': undefined
};

export function RaindropFeedItem({ input }: { input: FeedItem }) {
  const { id, type, date, data } = input;
  if (!data.raindrop) return null;
  return (
    <FeedLineItemV2 key={id} type={type} date={date}>
      <Link href={data.raindrop.link} target="_blank" className={'small'}>
        {/*{data.raindrop?.title?.split(' ').slice(0, 10).join(' ')}...*/}
        {formatTitle(data.raindrop?.title)}...
      </Link>
      <br />
      {data.raindrop?.excerpt && (
        <details className={'small'}>
          <summary>{formatTitle(data.raindrop?.title)}...</summary>
          {data.raindrop?.excerpt}
        </details>
      )}
      {data.raindrop?.note && (
        <blockquote className={'small'}>{data.raindrop?.note}</blockquote>
      )}
      {data.raindrop?.highlights?.length > 0 && (
        <>
          <b className={'small'}>Highlights:</b>
          {data.raindrop?.highlights.map((x) => (
            <blockquote key={x._id} className={'small'}>
              {x.text}
            </blockquote>
          ))}
        </>
      )}
    </FeedLineItemV2>
  );
}
