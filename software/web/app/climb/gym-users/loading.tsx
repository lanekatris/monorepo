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

export default function GymUsersPageLoading() {
  return (
    <Container maxWidth={'sm'}>
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Gym Users</Typography>
      </Breadcrumbs>

      <Typography level={'h4'} gutterBottom>
        Recent Gym Users
      </Typography>
      <List>
        <ListItem>
          <ListItemContent>
            <b>Today</b>: {new Date().toISOString().split('T')[0]}
          </ListItemContent>
        </ListItem>
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
