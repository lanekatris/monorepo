import {
  Breadcrumbs,
  Container,
  Link,
  List,
  ListItem,
  Typography,
} from '@mui/joy';

export default async function AdminPage() {
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>Admin Dashboard</Typography>
      </Breadcrumbs>
      <h1>do buttons here</h1>
    </Container>
  );
}
