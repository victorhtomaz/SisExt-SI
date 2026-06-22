import { defineConfig } from 'drizzle-kit';
import jetEnv, { str } from 'jet-env';

import 'dotenv/config';

const { DatabaseUrl } = jetEnv({
  DatabaseUrl: str,
});

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: DatabaseUrl,
  },
});