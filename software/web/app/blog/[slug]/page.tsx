import { Container, Typography } from '@mui/joy';
import { posts } from '../../../.velite';
import { notFound } from 'next/navigation';

interface PostProps {
  params: {
    slug: string;
  };
}
function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function generateStaticParams(): PostProps['params'][] {
  return posts.map((post) => ({
    slug: post.slug
  }));
}

export default function BlogPostPage({ params }: PostProps) {
  const post = getPostBySlug(params.slug);

  if (post == null) notFound();

  return (
    <Container maxWidth="sm">
      <Typography>{post.title}</Typography>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
    </Container>
  );
}
