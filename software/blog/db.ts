// import { neon } from "@neondatabase/serverless";
//
// const db = neon(import.meta.env.DATABASE_URL);
//
// export default db;

import pg from 'pg'

const client = new pg.Client(import.meta.env.DATABASE_URL)

await client.connect()
export default client;
