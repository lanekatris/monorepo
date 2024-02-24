import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import {
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy';
import Link from 'next/link';
import { login, getMembers } from '@lkat/rhinofit-unofficial';

export const revalidate = 3600; // revalidate the data at most every hour
export default withPageAuthRequired(async function GymUsers() {
  const credentials = await login({
    email: process.env.RHINOFIT_EMAIL!,
    password: process.env.RHINOFIT_PASSWORD!,
  });
  const members = await getMembers(credentials);

  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Gym Users</Typography>
      </Breadcrumbs>

      <Typography level="h4" gutterBottom>
        Recent Gym Users
      </Typography>
      <List>
        <ListItem>
          <ListItemContent>
            <b>Today</b>
            {': '}
            {new Date().toISOString().split('T')[0]}
          </ListItemContent>
        </ListItem>
        {members.map((member) => (
          <ListItem key={member}>
            <ListItemContent>{member}</ListItemContent>
          </ListItem>
        ))}
      </List>
    </Container>
  );
});
