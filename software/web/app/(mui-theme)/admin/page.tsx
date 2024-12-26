import {
  Alert,
  Breadcrumbs,
  Button,
  Container,
  Link,
  Typography
} from '@mui/joy';
import NextLink from 'next/link';
import { sql } from '@vercel/postgres';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { groupBy } from 'lodash';
import { unstable_noStore as noStore } from 'next/cache';
import { getServerSession } from 'next-auth';
import React from 'react';

import { NotAuthorized } from '../../(blog)/feed/notAuthorized';
import { createEvent } from '../../../lib/createEvent';

export const dynamic = 'force-dynamic';

export interface Url {
  id: number;
  name: string;
  url: string;
  tags: string;
  clicks: number;
}

export interface Maintenance {
  id: number;
  title: string;
  Date: Date;
  Property: string;
  Notes?: string;
}

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  noStore();

  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  async function click(formData: FormData) {
    'use server';

    const id = formData.get('id');
    const url = formData.get('url');
    if (!id) throw new Error('id is required');
    if (!url || typeof url !== 'string') throw new Error('url is required');

    await sql`update noco.url set clicks = clicks + 1 where id = ${+id}`;

    // THIS IS F**KING CRITICAL FOR DATA TO UPDATE AS EXPECTED
    revalidatePath('/admin');

    redirect(url);
  }

  async function createSimpleEvent(formData: FormData) {
    'use server';
    const eventName = formData.get('eventName');
    if (!eventName) throw new Error('eventName is required');
    await createEvent(eventName.toString());
    revalidatePath('/admin');
    redirect('/admin?success=true');
  }

  const {
    rows: urls
  }: {
    rows: Array<Url>;
  } = await sql`select * from noco.url order by clicks desc`;

  const { rows: maintenances }: { rows: Array<Maintenance> } =
    await sql`select * from noco.maintenance order by "Date" desc`;

  const grouped = groupBy(maintenances, 'Property');

  const {
    rows: purchases
  }: {
    rows: {
      title: string;
      Date: Date;
      Cost: number;
      Tags: string;
      id: number;
    }[];
  } = await sql`select * from noco.purchases order by "Date" desc`;

  const success = (await searchParams).success;
  console.log('success', success);

  const { rows: events }: { rows: { name: string; value: string }[] } =
    await sql`select * from noco.config`;
  return (
    <Container maxWidth="sm">
      {/*<Breadcrumbs>*/}
      {/*  <Link color="neutral" href="/">*/}
      {/*    Home*/}
      {/*  </Link>*/}
      {/*  <Typography>Admin Dashboard</Typography>*/}
      {/*</Breadcrumbs>*/}

      <ul
        style={{
          backgroundColor: '#ffffce',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}
      >
        {urls.map((u) => (
          <li key={u.name}>
            <form action={click}>
              <input type="hidden" name="id" value={u.id} />
              <input type="hidden" name="url" value={u.url} />

              <Button variant="plain" type="submit" size="sm">
                {u.name}
              </Button>

              <Typography display="inline" level="body-xs">
                ({u.clicks} clicks)
              </Typography>
              <Typography display="inline" level="body-xs" ml="1em">
                #{u.tags}
              </Typography>
            </form>
          </li>
        ))}
      </ul>

      <Typography level="h4">Events</Typography>
      <a
        href="https://noco.lkat.io/dashboard/#/nc/form/c68b0a6e-cd33-4c89-ba34-3e7c78fd013c"
        target="_blank"
      >
        Add Event
      </a>
      <div
        style={{
          backgroundColor: '#ffffce',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}
      >
        {events.map(({ name, value }) => (
          <form action={createSimpleEvent} key={name}>
            <input type={'hidden'} name={'eventName'} value={value} />
            <Button variant="plain" type="submit" size="sm">
              {name}
            </Button>
          </form>
        ))}
        {success && (
          <Alert
            color={'success'}
            endDecorator={
              <NextLink href={'/admin'} scroll={false}>
                X
              </NextLink>
            }
          >
            Success!
          </Alert>
        )}
      </div>
      <Typography level="h4">Maintenance </Typography>
      <ul
        style={{
          backgroundColor: '#ffffce',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}
      >
        {Object.keys(grouped).map((key) => (
          <li key={key}>
            <b>{key}</b>
            <ul>
              {grouped[key].map((m) => (
                <li key={m.id}>
                  <Typography display="inline" level="body-xs">
                    {m.Date.toLocaleDateString()} ::
                  </Typography>{' '}
                  {m.title}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <Typography level="h4">Purchases </Typography>
      <ul
        style={{
          backgroundColor: '#ffffce',
          paddingTop: '20px',
          paddingBottom: '20px'
        }}
      >
        {purchases.map(({ id, title, Date, Tags, Cost }) => (
          <li key={id}>
            {Date.toLocaleDateString()} ::
            {title} :: {Cost} :: {Tags}
          </li>
        ))}
      </ul>
    </Container>
  );
}
