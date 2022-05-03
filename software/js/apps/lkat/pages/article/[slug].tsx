import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SyntaxHighlighter from 'react-syntax-highlighter';
import Image from 'next/image';
import ScoreCardImage from '../../components/disc-golf/score-card-image/score-card-image';
import ScoreBadges from '../../components/disc-golf/score-badges/score-badges';
import Alert from '../../components/alert/alert';

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
  ScoreCardImage: ScoreCardImage,
  Alert,
  h3: (props) => (
    <h3 className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
      {props.children}
    </h3>
  ),
  h1: (props) => (
    <h1 className="text-xl font-bold text-gray-800 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
      {props.children}
    </h1>
  ),
  Image,
  p: (props) => <p className="mt-5 mb-5">{props.children}</p>,
  a: (props) => (
    <a className="underline" href={props.href} target="_blank">
      {props.children}
    </a>
  ),
  li: (props) => (
    <>
      <span>
        <span className="bg-indigo-100 text-indigo-500 w-4 h-4 mr-2 rounded-full inline-flex items-center justify-center">
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            className="w-3 h-3"
            viewBox="0 0 24 24"
          >
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        </span>
        {props.children}
      </span>
    </>
  ),
  ul: (props) => (
    <nav className="mt-5 mb-5 flex flex-col sm:items-start sm:text-left text-center items-center space-y-2.5">
      {props.children}
    </nav>
  ),
};

/* eslint-disable-next-line */
export interface ArticleProps {}

export function Article(props) {
  const {
    frontMatter: { title, date, tags, scores },
    mdxSource,
  } = props;
  console.log(props);
  return (
    <div className="mb-5 max-w-2xl px-8 py-4 mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-gray-600 dark:text-gray-400">
          {date}
        </span>
        <div>
          {tags &&
            tags.length &&
            tags.map((tag) => (
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
        <p className="text-4xl font-bold text-gray-700 dark:text-white mb-5">
          {title}
        </p>
        <div>
          {(scores || []).length > 0 && (
            <div>
              DG Scores:{' '}
              {(scores || []).map((score, i) => (
                <ScoreBadges key={i} score={score} />
              ))}
            </div>
          )}
        </div>

        <MDXRemote {...mdxSource} components={components} />
      </div>
    </div>
  );
}

export default Article;
