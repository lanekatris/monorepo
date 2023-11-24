import { Client } from 'pg';
import {
  Button,
  List,
  ListItem,
  Title,
  Text,
  Card,
  Subtitle,
} from '@tremor/react';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

// interface ClimbDetailPageProps {
//   params: {
//     date: string;
//   };
// }

async function executeSql<T>(
  sql: string,
  parameters: (string | number)[] = []
): Promise<T> {
  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });

  await client.connect();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { rows }: { rows: T } = await client.query(sql, parameters);

  await client.end();

  return rows;
}

function getClimbDetail(isoDate: string) {
  return executeSql<{ id: number; climb: string }[]>(
    `select id,"Climb" climb from noco.climb_log_v1 where "Date" = $1`,
    [isoDate.split('T')[0]]
  );
}

const options = [
  'V0 Attempt',
  'V0 Send',
  'V0 New Send',
  'V1 Attempt',
  'V1 Send',
  'V1 New Send',
  'V2 Attempt',
  'V2 Send',
  'V2 New Send',
  'V3 Attempt',
  'V3 Send',
  'V3 New Send',
  'V4 Attempt',
  'V4 Send',
  'V4 New Send',
  'V5 Attempt',
  'V5 Send',
  'V5 New Send',
  'V6 Attempt',
  'V6 Send',
  'V6 New Send',
  'V7 Attempt',
  'V7 Send',
  'V7 New Send',
  'V8 Attempt',
  'V8 Send',
  'V8 New Send',
];

export default withPageAuthRequired(async function ClimbDetailPage({ params }) {
  const date = params?.date;
  if (typeof date !== 'string') throw new Error('unknown date');

  async function createClimb(formData: FormData) {
    'use server';
    console.log('hit me', formData);
    const climb = formData.get('climb');
    if (!climb) throw new Error('climb not given');

    await executeSql(
      `insert into noco.climb_log_v1 ("Date", "Climb") values ($1, $2)`,
      [new Date().toISOString().split('T')[0], climb.toString()]
    );

    revalidatePath(`/climb/logger/${date}`);
  }

  const climbDetails = await getClimbDetail(date);
  console.log('climbdetails', climbDetails);

  return (
    <main className="mx-5 mt-5">
      <Button variant="light">
        <Link href="/climb/logger">Climb List</Link>
      </Button>

      <Card className="mt-5 mb-5">
        <form action={createClimb} className="mx-5">
          <Title>Add Climb</Title>

          <select name="climb">
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {/*<FormButton />*/}
          <Button type="submit" size="xs">
            Save
          </Button>
          {/*<Button>tow</Button>*/}
        </form>
      </Card>

      <Title>
        {date.split('T')[0]} Climb History ({climbDetails.length})
      </Title>

      <List>
        {climbDetails.map(({ id, climb }, i) => (
          <ListItem key={id}>
            <Text>
              {i + 1}) {climb}
            </Text>
          </ListItem>
        ))}
        {climbDetails.length === 0 && (
          <ListItem>
            <Subtitle>None so far...</Subtitle>
          </ListItem>
        )}
      </List>
    </main>
  );
});

// function FormButton() {
//   const { pending } = useFormStatus();
//   return (
//     <Button type={'submit'} size="xs" loading={pending}>
//       Save
//     </Button>
//   );
// }
