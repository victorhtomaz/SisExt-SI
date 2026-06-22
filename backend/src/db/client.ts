import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import EnvVars from '@src/common/constants/env';
import * as schema from './schema';

function createPool() {
  const databaseUrl = EnvVars.DatabaseUrl;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured.');
  }

  return new Pool({
    connectionString: databaseUrl,
  });
}

export const pool = createPool();
export const db = drizzle(pool, { schema });
export type Database = typeof db;