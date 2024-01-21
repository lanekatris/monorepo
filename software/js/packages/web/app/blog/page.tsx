import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { postsDirectory } from 'packages/web/app/blog/shared';

// export const slugify = (str: string) =>
//   str
//     // .toLowerCase()
//     .trim()
//     // .replace(/[^\w\s-]/g, '')
//     // .replace(/[\s_-]+/g, '-')
//     .replace(/^-+|-+$/g, '');
// // .replace(/\d{4}-\d{2}-\d{2}-/, '');

function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id: id,
      // slug: slugify(id),
      ...matterResult.data,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    // @ts-ignore
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li>
            {/*@ts-ignore*/}
            {post.title} on {post.date.toLocaleDateString()}
            <Link href={`/blog/${post.id}`}>View</Link>
            <br />
            Slug: {post.id}
          </li>
        ))}
      </ul>
    </>
  );
}
