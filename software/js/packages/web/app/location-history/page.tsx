import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { Client } from 'pg';

interface Location {
  Address: string;
  Name: string;
}

export default withPageAuthRequired(async function LocationHistoryPage({
  searchParams,
}) {
  const session = await getSession();

  const client = new Client({
    ssl: true,
    connectionString: process.env.POSTGRES_CONN_URL,
  });
  await client.connect();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const query = (searchParams?.query || 'colorado').toLowerCase();
  const { rows }: { rows: Location[] } = await client.query(
    `select "Address", "Name" from tap_csv.values where lower("Address") like $1 or lower("Name") like $1  limit 100`,
    [`%${query}%`]
  );
  await client.end();

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <a href="/">Home</a>
        <br />
        {session?.user && (
          <>
            <a href="/api/auth/logout">Logout</a>
          </>
        )}
        {!session?.user && <a href="/api/auth/login">Login</a>}
      </div>

      <h4>Your Location History</h4>
      <form style={{ marginBottom: '1.5em' }}>
        <input
          autoFocus
          name="query"
          type="search"
          placeholder="Do Me"
          style={{ width: '100%', marginBottom: '.5em' }}
          defaultValue={query}
        />
        <button type="submit">Search</button>
      </form>
      <fieldset>
        <legend>Results ({rows.length})</legend>

        {rows.map(({ Address, Name }) => (
          <div key={Address + Name}>
            <b>{Name}</b> - {Address}
            <hr />
          </div>
        ))}
      </fieldset>
    </>
  );
});
