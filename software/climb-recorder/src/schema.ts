import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const sqlite = new Database('sqlite.db');

export const pendingFile = sqliteTable('pending_file', {
  id: text('id').primaryKey(),
  filename: text('filename'),
  startDate: integer('startDate'),
  endDate: integer('endDate'),
  status: text('status'),
  videoLength: integer('videoLength'),


})

export const db = drizzle(sqlite, {schema:{...pendingFile}});
