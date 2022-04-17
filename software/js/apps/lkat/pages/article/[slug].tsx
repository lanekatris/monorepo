import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SyntaxHighlighter from 'react-syntax-highlighter';

export const getStaticPaths = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'posts'));
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
    path.join(process.cwd(), 'posts', slug + '.mdx'),
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

const components = {
  SyntaxHighlighter,
  h3: (props) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
      {props.children}
    </h3>
  ),
};

/* eslint-disable-next-line */
export interface ArticleProps {}

export function Article(props: ArticleProps) {
  const {
    frontMatter: { title, date, tags },
    mdxSource,
  } = props;
  console.log(props);
  return (
    <div className="max-w-2xl px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-gray-600 dark:text-gray-400">
          {date}
        </span>
        <div>
          {tags.map((tag) => (
            <a
              key={tag}
              className="px-3 mr-2 py-1 text-sm font-bold text-gray-100 transition-colors duration-200 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-2">
        <p className="text-2xl font-bold text-gray-700 dark:text-white">
          {title}
        </p>
        <MDXRemote {...mdxSource} components={components} />
      </div>
    </div>
  );
}

export default Article;
