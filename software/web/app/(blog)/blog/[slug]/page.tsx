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

  // console.log('post', post);

  return (
    <>
      <main>
        {/*<h1>{post.title}</h1>*/}
        {/*<small className="smaller">*/}
        {/*  <span>Updated: </span>*/}
        {/*  <span className="bg-muted">{post.lastModified.split('T')[0]}</span>*/}
        {/*</small>*/}
        {/*<br />*/}
        {/*<br />*/}
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <hr />
        <small className="flash muted">
          <b>Date</b>: {post.date.split('T')[0]}
          {post.tags && (
            <>
              {' | '}
              <b>Tags</b>: {post.tags?.map((t) => `#${t}`).join(', ')}
            </>
          )}
        </small>
        <hr />
      </main>
    </>
  );
}
