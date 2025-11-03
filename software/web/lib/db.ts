import { Pool, PoolClient, QueryResult } from 'pg';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  // Optional: configure pool settings
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle
  connectionTimeoutMillis: 2000, // how long to wait for a connection
});

// Template literal function for SQL queries (similar to @vercel/postgres)
export function sql(strings: TemplateStringsArray, ...values: any[]): Promise<QueryResult<any>> {
  // Build the query string
  let query = '';
  for (let i = 0; i < strings.length; i++) {
    query += strings[i];
    if (i < values.length) {
      query += `$${i + 1}`;
    }
  }
  
  return pool.query(query, values);
}

// Export the pool for direct access if needed
export { pool };

// Export types for compatibility
export type { QueryResult };
