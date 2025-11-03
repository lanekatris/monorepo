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
export async function query<T>(text: string, params?: any[]): Promise<T[]> {
	const {rows} = await pool.query(text, params);
	return rows;
}
// export default client;
