import {
  Alert,
  Breadcrumbs,
  Container,
  List,
  ListItem,
  ListItemContent,
  ListSubheader,
  Typography
} from '@mui/joy';
import Link from 'next/link';
import { login } from '../../../rhinofit/auth';
import { getMembers } from '../../../rhinofit/recent-access';
import { groupBy } from 'lodash';
import { getServerSession } from 'next-auth';
import React from 'react';
import { NotAuthorized } from '../../feed/page';

export const dynamic = 'force-dynamic';
export default async function GymUsers() {
  const credentials = await login({
    email: process.env.RHINOFIT_EMAIL!,
    password: process.env.RHINOFIT_PASSWORD!
  });
  const members = await getMembers(credentials);

  const grouped = groupBy(members, (x) => x.date);

  const session = await getServerSession();
  if (!session) return <NotAuthorized />;
  return (
    <Container maxWidth="sm">
      <Breadcrumbs>
        <Link color="neutral" href="/">
          Home
        </Link>
        <Typography>
          Gym Users
          <Typography level={'body-xs'} sx={{ marginLeft: 1 }}>
            Today: {new Date().toISOString().split('T')[0]}
          </Typography>
        </Typography>
      </Breadcrumbs>

      {/*<Typography level="h4" gutterBottom>*/}
      {/*  Recent Gym Users*/}
      {/*</Typography>*/}
      <List>
        {/*<ListItem> <ListItemContent>*/}
        {/*    <b>Today</b>*/}
        {/*    {': '}*/}
        {/*    {new Date().toISOString().split('T')[0]}*/}
        {/*  </ListItemContent>*/}
        {/*</ListItem>*/}
        {Object.keys(grouped).map((key) => (
          <ListItem nested key={key}>
            <ListSubheader>
              <b>{key}</b>
            </ListSubheader>
            <List sx={{ backgroundColor: '#ffffce' }}>
              {grouped[key].map(({ id, time, name }) => (
                <ListItem key={id}>
                  <ListItemContent>
                    {name} <Typography level={'body-xs'}>{time}</Typography>
                  </ListItemContent>
                </ListItem>
              ))}
            </List>
          </ListItem>
        ))}
        {/*{members.map(({ id, date, name }) => (*/}
        {/*  <ListItem key={id}>*/}
        {/*    <ListItemContent>*/}
        {/*      {date} - {name}*/}
        {/*    </ListItemContent>*/}
        {/*  </ListItem>*/}
        {/*))}*/}
      </List>
    </Container>
  );
}
