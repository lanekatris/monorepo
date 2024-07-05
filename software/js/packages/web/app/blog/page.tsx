import Link from 'next/link';
import { getSortedArticles } from '../../lib/articles';

export default function BlogPage() {
  const articles = getSortedArticles();

  const content = [
    {
      path: '/blog/2024/2024-06-23-disc-golf',
    },
  ];
  return (
    <Container maxWidth="sm">
      <ul>
        {content.map((c) => (
          <li key={c.path}>
            <Link href={c.path}>{c.path}</Link>
          </li>
        ))}
      </ul>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/blog/${article.id}`}>
              {article.date} - {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
