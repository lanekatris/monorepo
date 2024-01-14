// import { List, ListItem, Title, Text, Button } from '@tremor/react';
import Link from 'next/link';
import { Client } from 'pg';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

interface ClimbListLog {
  Date: Date;
}

async function getClimbLogs() {
  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });

  await client.connect();
  const sql = `select "Date" from noco.climb_log_v1 group by "Date" order by "Date" desc`;

  const { rows }: { rows: ClimbListLog[] } = await client.query(sql);
  await client.end();

  return rows;
}

export default withPageAuthRequired(async function Page() {
  const climbLogs = await getClimbLogs();
  console.log(climbLogs);
  return (
    <main className="mx-5 mt-5">
      {/*<Button variant="light">*/}
      {/*  <Link href="/">Home</Link>*/}
      {/*</Button>*/}
      {/*<Title>Climb Logs ({climbLogs.length})</Title>*/}

      {/*<List>*/}
      {/*  {climbLogs.map(({ Date }) => (*/}
      {/*    <ListItem key={Date.toString()}>*/}
      {/*      <Button variant={'light'}>*/}
      {/*        <Link href={`/climb/logger/${Date.toISOString()}`}>*/}
      {/*          {Date.toLocaleDateString()}*/}
      {/*        </Link>*/}
      {/*      </Button>*/}
      {/*    </ListItem>*/}
      {/*  ))}*/}
      {/*</List>*/}
    </main>
  );
});
