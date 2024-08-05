import Link from 'next/link';
import {
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography
} from '@mui/joy';
import { posts } from '../../.velite';

console.log(
  'p',
  posts.map((x) => ({ draft: x.draft, name: x.title }))
);

export default function BlogPage() {
  return (
    <>
      <List>
        {posts
          .filter((p) => p.draft !== true)
          .sort((a, b) => {
            return new Date(b.date).valueOf() - new Date(a.date).valueOf();
          })
          .map((c) => (
            <ListItem key={c.slug}>
              <ListItemContent>
                <Link href={c.permalink}>{c.title}</Link>
                <Typography level={'body-xs'}>
                  {c.date.split('T')[0]}
                </Typography>
              </ListItemContent>
            </ListItem>
          ))}
      </List>
    </>
  );
}
