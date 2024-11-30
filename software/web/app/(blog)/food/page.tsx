import {
  getRaindrops,
  RAINDROP_COLLECTION_RECIPES
} from '../../../feed/get-feed';
import { RaindropFeedItem } from '../feed/page';
import { sql } from '@vercel/postgres';
import { getServerSession } from 'next-auth';
import { NotAuthorized } from '../feed/notAuthorized';
import React from 'react';
import { createEvent } from '../../../lib/createEvent';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { SubmitButton } from './SubmitButton';
import NextLink from 'next/link';

export default async function FoodPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  noStore();
  const session = await getServerSession();
  if (!session) return <NotAuthorized />;

  const success = (await searchParams).success;

  async function clear(formData: FormData) {
    'use server';

    const id = formData.get('id');
    if (!id) throw new Error('id is required');

    // Wait for the workflow to finish as it creates data in the DB our page query relies on
    const handle = await createEvent(
      'groceries_cleared_v1',
      JSON.stringify({ eventId: +id })
    );
    const result = await handle.result();
    console.log('result', result);
    revalidatePath('/food');
    redirect('/food?success=true');
  }

  const raindrops = await getRaindrops();
  const recipes = raindrops.filter(
    (x) => x.data.raindrop?.collectionId === RAINDROP_COLLECTION_RECIPES
  );

  const { rows }: { rows: { event_id: number }[] } =
    await sql`select cast(data::jsonb->>'eventId' as integer) event_id from events where event_name='groceries_cleared_v1' order by created_at desc limit 1`;

  const eventId = rows[0]?.event_id ?? 0;
  console.log('event id', eventId);

  const {
    rows: cartItems
  }: {
    rows: {
      id: number;
      created_at: Date;
      barcode: string;
      name: string | undefined;
    }[];
  } =
    await sql`select e.id, e.created_at at time zone 'EST' created_at, data::jsonb->'barcode' barcode, ng.name
from events e
    left join noco.grocery ng on ng.barcode = data::jsonb->>'barcode'
where event_name = 'barcode_scanned_v1' and data::jsonb->>'barcode' != 'abc123'
and e.id > ${eventId}
            order by created_at desc`;

  return (
    <main>
      <h1>Shopping List ({cartItems.length})</h1>
      {success && (
        <div className={' bg-success'}>
          Success{' '}
          <NextLink href={'/food'} scroll={false}>
            X
          </NextLink>
        </div>
      )}
      {cartItems.length === 0 && (
        <div className="bg-success">No groceries to buy!</div>
      )}
      <ul>
        {cartItems.map(({ id, created_at, barcode, name }) => (
          <li key={created_at.toISOString()}>
            <small className={'muted'}>{barcode}</small>
            <br />
            {name ?? (
              <>
                <a target="_blank" href={`https://www.upcindex.com/${barcode}`}>
                  UPC Index
                </a>
                {' | '}
                <a
                  target="_blank"
                  href={`https://noco.lkat.io/dashboard/#/nc/form/fe5e017c-df15-4740-855b-5404cd282d93?barcode=${barcode}`}
                >
                  Add to noco
                </a>
              </>
            )}
            <form
              style={{ background: 'none', display: 'inline' }}
              action={clear}
            >
              <input type="hidden" name="id" value={id} />
              <SubmitButton />
            </form>
          </li>
        ))}
      </ul>

      <h1>Food Bookmarks ({recipes.length})</h1>
      {recipes.map((recipe) => (
        <RaindropFeedItem key={recipe.id} input={recipe} />
      ))}
    </main>
  );
}
