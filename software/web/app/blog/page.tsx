import Link from 'next/link';
import { Container } from '@mui/joy';

export default function BlogPage() {
  const content = [
    {
      path: '/blog/2024-06-23-disc-golf',
    },
  ];
  return (
    <Container maxWidth="sm">
      <ul>
        {content.map((c) => (
          <li key={c.path}>
            <Link href={c.path}>{c.path.replace('/blog/', '')}</Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
