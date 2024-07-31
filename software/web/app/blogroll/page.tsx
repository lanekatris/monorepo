import { Breadcrumbs, Container, Link, Typography } from '@mui/joy';
import { getRssOpml } from './opml/getRssOpml';
import React from 'react';
const opml = require('opml');

export const dynamic = 'force-dynamic';
interface OpmlResponse {
  subs: {
    text: string;
    subs: {
      title: string;
      text: string;
      xmlUrl: string;

      htmlUrl: string;
      type: 'rss';
    }[];
  }[];
}

async function parseOpml(): Promise<OpmlResponse> {
  const xml = await getRssOpml();
  return new Promise<OpmlResponse>((resolve, reject) => {
    opml.parse(xml, function (err: Error, result: any) {
      if (err) return reject(err);

      return resolve(result.opml.body);
    });
  });
}

export default async function PodRollPage() {
  const data = await parseOpml();

  return (
    <Container maxWidth="md">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography fontWeight="bold">Blog Roll</Typography>
      </Breadcrumbs>

      <Typography>
        I switched from Feedly to self-hosting Miniflux on TODO because Feedly
        requires a paid/Enterprise plan to use their api now.
      </Typography>
      <br />
      <Typography>
        I've deleted quite a few that had broken links. It was a little
        surprising so many domains had expired.
      </Typography>
      <br />
      {/*<Typography>*/}
      {/*  I want to organize more but I have <b>{Object.keys(grouped).length}</b>{' '}*/}
      {/*  categories and <b>{blogs.length}</b> RSS feeds.{' '}*/}
      {/*</Typography>*/}
      <Typography>
        Download my latest RSS feed OPML <a href="/blogroll/opml">here</a>
      </Typography>

      <ul>
        {data.subs.map((parent) => (
          <li key={parent.text}>
            {parent.text} ({parent.subs.length})
            <ul>
              {parent.subs.map((blog) => (
                <li key={blog.title}>
                  {blog.title} :: <a href={blog.htmlUrl}>Site</a>
                  {' | '}
                  <a href={blog.xmlUrl}>Feed</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Container>
  );
}
