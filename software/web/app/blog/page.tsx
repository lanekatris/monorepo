import Link from 'next/link';
import {
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography
} from '@mui/joy';
import { posts } from '../../.velite';

// console.log('p', posts);

export default function BlogPage() {
  return (
    <>
      <List>
        {posts.map((c) => (
          <ListItem key={c.slug}>
            <ListItemContent>
              <Link href={c.permalink}>{c.title}</Link>
              <Typography level={'body-xs'}>{c.date.split('T')[0]}</Typography>
            </ListItemContent>
          </ListItem>
        ))}
      </List>
    </>
  );
}
