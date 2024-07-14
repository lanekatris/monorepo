// @ts-nocheck

import { Container, Typography } from '@mui/joy';
// import blogs from './blogroll.json';
// import { opmlToJSON } from 'opml-to-json';
import { getRssOpml } from './opml/getRssOpml';
const opml = require('opml');

// function isParent(idk: Parent | Item){
//
// }
// type Idk = opmlToJsonResult['children'];

// function isParent(idk: Idk): idk is Idk['Parent'] {}

export const dynamic = 'force-dynamic';

export default async function PodRollPage() {
  //   const { rows } =
  //     await sql`select f.id, c.title category_name, f.title, f.feed_url, f.site_url
  // from feeds f
  //          inner join categories c on c.id = f.category_id
  // order by c.title`;

  // console.log('rows', rows[0]);

  // const { data: xml } = await axios.get<string>(
  //   'http://server1.local:8663/v1/export',
  //   {
  //     headers: {
  //       'X-Auth-Token': process.env.MINIFLUX_API_KEY,
  //     },
  //   }
  // );
  const xml = await getRssOpml();
  // const xml = await response.text();
  // const opml = await opmlToJSON(xml);
  // console.log('aaaaaaaa', json);
  opml.parse(xml, function (err, result) {
    console.log({ err, result }, result.opml.head, result.opml.body);
  });
  // console.log('bbb', opml.children[0].children);

  // const grouped = groupBy(blogs, (x) => x.category_name);
  // console.log('grouped', grouped);
  // return <h1>hi there</h1>;
  return (
    <Container maxWidth="md">
      {/*{blogs.map((blog) => (*/}
      {/*  <div key={blog.id}>{blog.title}</div>*/}
      {/*))}*/}
      <br />
      <Typography>
        I switched from Feedly to self-hosting Miniflux on TODO because Feedly
        requires a paid/Enterprise plan to use their api now.
      </Typography>
      <Typography>
        I've deleted quite a few that had broken links. It was a little
        surprising so many domains had expired.
      </Typography>
      {/*<Typography>*/}
      {/*  I want to organize more but I have <b>{Object.keys(grouped).length}</b>{' '}*/}
      {/*  categories and <b>{blogs.length}</b> RSS feeds.{' '}*/}
      {/*</Typography>*/}
      <Typography>
        Download my latest RSS feed OPML <a href="/blogroll/opml">here</a>
      </Typography>

      <ul>
        {opml.children.map((parent) => (
          <li key={parent.text}>
            {parent.text} ({parent.children.length})
            <ul>
              {parent.children.map((blog) => (
                <li key={blog.title}>
                  {blog.title} :: <a href={blog.htmlurl}>Site</a>
                  {' | '}
                  <a href={blog.xmlurl}>Feed</a>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {/*{grouped.map((group) => (*/}
        {/*  <li>*/}
        {/*    {group.map((blg) => {*/}
        {/*      return <li>{blg.title}</li>;*/}
        {/*    })}*/}
        {/*  </li>*/}
        {/*))}*/}
      </ul>
    </Container>
  );
}
