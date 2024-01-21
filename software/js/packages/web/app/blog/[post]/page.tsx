import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { Box, Breadcrumbs, Container, Link, Typography } from '@mui/joy';
import { postsDirectory } from 'packages/web/app/blog/shared';

async function getPost({ slug }: { slug: string }) {
  console.log('getpost', slug);
  const fileContents = fs.readFileSync(
    `${postsDirectory}/${decodeURIComponent(slug)}.md`,
    'utf8'
  );
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  return {
    // id: slugify(slug),
    id: slug,
    contentHtml,
    ...matterResult.data,
  };
}

// @ts-ignore
export default async function BlogPost(params) {
  console.log('bbbb', params.post);

  const post = await getPost({ slug: params.params.post });
  console.log('ppp', post);
  return (
    <Container maxWidth="sm">
      {/*<h1>view yoru post</h1>*/}
      <Breadcrumbs>
        <Link color="neutral" href="/blog">
          Blog List
        </Link>
        <Typography>View Post</Typography>
      </Breadcrumbs>
      <Box dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </Container>
  );
}
