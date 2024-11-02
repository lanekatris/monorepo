import { sql } from '@vercel/postgres';
import notebook1 from './FN01_small.webp';
import notebook2 from './FN02_small.webp';
import notebook3 from './FN03_small.webp';
import notebook4 from './FN04_small.webp';
import notebook5 from './FN05_small.webp';
import notebook6 from './FN06_small.webp';

import Image from 'next/image';

export default async function NotebooksPage() {
  const { rows } = await sql`select * from noco.notebook order by "friendlyId"`;
  console.log(rows);
  return (
    <main>
      <h1>My Notebooks</h1>
      <Image src={notebook1} alt="Notebook 1" />
      <Image src={notebook2} alt="Notebook 2" />
      <Image src={notebook3} alt="Notebook 3" />
      <Image src={notebook4} alt="Notebook 4" />
      <Image src={notebook5} alt={'Notebook 5'} />
      <Image src={notebook6} alt={'Notebook 6'} />

      <h1>Stats</h1>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Bought On</td>
            <td>Completed On</td>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.friendlyId}</td>
              <td>
                <var>{row.status}</var>
              </td>
              <td>{row.dateBought?.toLocaleDateString()}</td>
              <td>{row.dateCompleted?.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
