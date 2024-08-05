import {
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  Skeleton,
  Typography,
} from '@mui/joy';
import Link from 'next/link';

export default function FeedLoading() {
  return (
    <Container>
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Feed</Typography>
      </Breadcrumbs>

      <List>
        <ListItem>
          <ListItemContent>
            <Typography>
              <Skeleton height={70} />
            </Typography>
          </ListItemContent>
        </ListItem>
        <ListItem>
          <ListItemContent>
            <Typography>
              <Skeleton height={70} />
            </Typography>
          </ListItemContent>
        </ListItem>
      </List>
    </Container>
  );
}
