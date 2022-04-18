import styles from './index.module.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Image from 'next/image';
import Link from 'next/link';

export const getStaticProps = async () => {
  const files = fs.readdirSync(path.join(process.cwd(), 'notes'));
  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'notes', filename),
      'utf-8'
    );
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      frontMatter,
      slug: filename.split('.')[0],
    };
  });
  return {
    props: {
      notes: posts,
    },
  };
};

/* eslint-disable-next-line */
export interface NotesProps {}

export function Notes({ notes }) {
  return (
    <div className="mt-5 pb-5">
      {notes.map((post, index) => (
        <div
          className="max-w-2xl mt-5 mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
          key={index}
        >
          <Image
            src={post.frontMatter.thumbnailUrl}
            alt="thumbnail"
            className="object-cover w-full h-64"
            objectFit="cover"
            width="700"
            height="300"
          />

          <div className="p-6">
            <div>
              {(post.frontMatter.tags || []).map((tag) => (
                <span
                  key={tag}
                  className="text-xs mr-2 font-medium text-blue-600 uppercase dark:text-blue-400"
                >
                  {tag}
                </span>
              ))}
              <Link href={`/article/${post.slug}`}>
                <a className="block mt-2 text-2xl font-semibold text-gray-800 transition-colors duration-200 transform dark:text-white hover:text-gray-600 hover:underline">
                  {post.frontMatter.title}
                </a>
              </Link>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {post.frontMatter.description}
              </p>
            </div>

            <div className="mt-4">
              <div className="flex items-center">
                <div className="flex items-center">
                  <img
                    className="object-cover h-10 rounded-full"
                    src="https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=48&q=60"
                    alt="Avatar"
                  />
                  <a
                    href="#"
                    className="mx-2 font-semibold text-gray-700 dark:text-gray-200"
                  >
                    Jone Doe
                  </a>
                </div>
                <span className="mx-1 text-xs text-gray-600 dark:text-gray-300">
                  {post.frontMatter.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Notes;
