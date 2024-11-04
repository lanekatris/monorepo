import { neon } from "@neondatabase/serverless";

const db = neon(import.meta.env.DATABASE_URL);

export default db;
