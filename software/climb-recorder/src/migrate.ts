
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './schema';
// npx tsx .\src\migrate.ts
// This will run migrations on the database, skipping the ones already applied
(async function(){
  await migrate(db, { migrationsFolder: './drizzle' });
})()

// Don't forget to close the connection, otherwise the script will hang
// await connection.end();