// import { neon } from "@neondatabase/serverless";
//
// const db = neon(import.meta.env.DATABASE_URL);
//
// export default db;

import {Pool} from 'pg'

// const client = new pg.Client(import.meta.env.DATABASE_URL)
const pool = new Pool({
	connectionString: import.meta.env.DATABASE_URL
})

// await client.connect()
export async function query(text: any, params?: any) {
	const res = await pool.query(text, params);
	return res.rows;
}
// export default client;
