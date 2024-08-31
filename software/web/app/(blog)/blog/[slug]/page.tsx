import { posts } from '../../../../.velite';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

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
    <>
      <nav>
        <ol>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/blog">Blog</Link>
          </li>
          <li>
            <Link href={post.permalink}>{post.title}</Link>
          </li>
        </ol>
      </nav>
      <main>
        <small>
          <b>Date</b>: {post.date.split('T')[0]}{' '}
          {post.tags && (
            <>
              <b>Tags</b>: {post.tags?.map((t) => `#${t}`).join(', ')}
            </>
          )}
        </small>
        <div
          className="article"
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
      </main>
    </>
  );
}
