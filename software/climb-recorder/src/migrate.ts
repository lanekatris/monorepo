
import { migrate } from 'drizzle-orm/sqlite-core/migrator';
import { db } from './schema';

// npx tsx .\src\migrate.ts

(async function(){
  await migrate(db, { migrationsFolder: './drizzle' });
})()
