import Navigation from 'packages/web/layout/navigation';
import { Breadcrumbs, Container, Link, Table, Typography } from '@mui/joy';
import { sql } from '@vercel/postgres';
import { Pie, ResponsiveContainer } from 'recharts';
// import DiscsChart from 'packages/web/app/discs/DiscsCharts';

export interface Disc {
  brand: string;
  color: string;
  model: string;
  plastic: string;
  number: bigint;
  status: string;
  weight: bigint;
  created: Date;
  price: number;
  notes: string;
  aces: bigint;
  id: number;
  created_at: Date;
  updated_at: Date;
  LostDate: Date;
}

export default async function DiscsPage() {
  const { rows }: { rows: Disc[] } =
    await sql`select * from noco."disc" order by id desc`;

  const total = rows.length;
  const totalInBag = rows.filter((x) => x.status === 'In Bag').length;

  // console.log(rows[0]);
  return (
    <Container maxWidth="lg">
      {/*<Breadcrumbs>*/}
      {/*  <Link color="neutral" href="/">*/}
      {/*    Home*/}
      {/*  </Link>*/}
      {/*  <Typography>Disc Golf Dashboard</Typography>*/}
      {/*</Breadcrumbs>*/}
      <Typography level="h4">Disc Golf Dashboard</Typography>

      <Table>
        <tbody>
          <tr>
            <td>Total Discs</td>
            <td>{total}</td>
          </tr>
          <tr>
            <td> Discs In Bag</td>
            <td>{totalInBag}</td>
          </tr>
          {/*aces*/}
        </tbody>
      </Table>

      {/*<ResponsiveContainer>*/}
      {/*  <Pie data={rows} dataKey="status" nameKey="status" label />*/}
      {/*</ResponsiveContainer>*/}
      {/*<DiscsChart discs={rows} />*/}

      <Table aria-label="basic table">
        {/*<thead>*/}
        {/*  <tr>*/}
        {/*    <th style={{ width: '40%' }}>Dessert (100g serving)</th>*/}
        {/*    <th>Calories</th>*/}
        {/*    <th>Fat&nbsp;(g)</th>*/}
        {/*    <th>Carbs&nbsp;(g)</th>*/}
        {/*    <th>Protein&nbsp;(g)</th>*/}
        {/*  </tr>*/}
        {/*</thead>*/}
        <tbody>
          {rows.map((disc) => (
            <tr key={disc.id}>
              <td>{disc.id}</td>
              <td>{disc.brand}</td>
              <td>{disc.color}</td>
              <td>{disc.model}</td>
              <td>{disc.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
  return (
    <main>
      <Navigation />
      <h1>Disc Database</h1>
      <iframe
        className="nc-embed"
        src="https://noco.lkat.io/dashboard/#/nc/view/19588d47-7626-443a-a182-2a9c10059421?embed"
        frameBorder="0"
        width="100%"
        height="700"
        // style="background: transparent; border: 1px solid #ddd"
        style={{ background: 'transparent', border: '1px solid #ddd' }}
      ></iframe>
    </main>
  );
}
