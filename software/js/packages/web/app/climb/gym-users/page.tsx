import {
  Alert,
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  Typography,
} from '@mui/joy';
import Link from 'next/link';
import { login, getMembers } from '@lkat/rhinofit-unofficial';
import { isAdmin } from 'packages/web/isAdmin';

export const dynamic = 'force-dynamic';
export default async function GymUsers() {
  if (!isAdmin()) return <Alert color="danger">Not Authorized</Alert>;
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
}
