import Layout from '../components/layout';
import { GraphQLClient, gql } from 'graphql-request';
import { GetFeedQuery, getSdk } from '../sdk';
import { useState } from 'react';

export const getServerSideProps = async () => {
  const client = new GraphQLClient(
    //'https://972yvjfqbj.execute-api.us-east-1.amazonaws.com/dev/graphql',
    'http://localhost:5298/graphql/',
    {
      headers: {
        'x-api-key': '',
      },
    }
  );
  // const result = await client.request(q);
  // console.log('result', result);
  // return {
  //   props: { hi: 'there' },
  // };
  const feed = await getSdk(client).getFeed();
  return {
    props: { feed },
  };
};

export default function Page({ feed }: { feed: GetFeedQuery }) {
  const [sdk] = useState(
    getSdk(new GraphQLClient('http://localhost:5298/graphql'))
  );

  console.log('data', feed, sdk);
  return (
    <Layout>
      <h1>This page is protected by Middleware</h1>
      <p>Only admin users can see this page.</p>
      <p>
        To learn more about the NextAuth middleware see&nbsp;
        <a href="https://docs-git-misc-docs-nextauthjs.vercel.app/configuration/nextjs#middleware">
          the docs
        </a>
        .
      </p>
      <h1>Maintenance</h1>
      <ul>
        {feed.maintenance.map((x) => (
          <li key={x.id}>{x.name}</li>
        ))}
      </ul>
      <h1>Feed</h1>
      <ul>
        {feed.feed.map((x) => (
          <li key={x.id}>{x.message}</li>
        ))}
      </ul>
      <h1>Read Later ({feed.bookmark.totalCount})</h1>
      {feed.bookmark.nodes.map((x) => (
        <li
          key={x.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: 20,
          }}
        >
          <img alt="No Loady" src={x.imageUrl} height={100} width={100} />
          <a href={x.url} target="_blank" rel="noreferrer">
            {x.name}
          </a>
          <button
            onClick={async () => {
              console.log('mark as read');
              await sdk.BookmarkRead({
                id: x.id,
              });
              location.reload();
            }}
          >
            Mark as Read
          </button>
        </li>
      ))}
    </Layout>
  );
}
