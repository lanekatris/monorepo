import {
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  Skeleton,
  Typography
} from '@mui/joy';
import Link from 'next/link';

export default function GymUsersPageLoading() {
  return (
    <Container maxWidth={'sm'}>
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Gym Users</Typography>
      </Breadcrumbs>

      <List>
        <ListItem>
          <ListItemContent>
            <Typography>
              <Skeleton />
            </Typography>
          </ListItemContent>
        </ListItem>
      </List>
    </Container>
  );
}
