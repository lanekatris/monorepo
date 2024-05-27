import Link from 'next/link';
import { getSortedArticles } from '../../lib/articles';

export default function BlogPage() {
  const articles = getSortedArticles();
  return (
    <section>
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
