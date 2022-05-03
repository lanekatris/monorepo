import styles from './index.module.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import Article from '../article/[slug]';

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'notes'));
  const paths = files.map((filename) => ({
    params: {
      slug: filename.replace('.mdx', ''),
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  const markdownWithMeta = fs.readFileSync(
    path.join(process.cwd(), 'notes', slug + '.mdx'),
    'utf-8'
  );
  const { data: frontMatter, content } = matter(markdownWithMeta);
  const mdxSource = await serialize(content);
  return {
    props: {
      frontMatter,
      slug,
      mdxSource,
    },
  };
};

/* eslint-disable-next-line */
export interface NoteProps {}

export function Note(props: NoteProps) {
  return Article(props);
}

export default Note;
