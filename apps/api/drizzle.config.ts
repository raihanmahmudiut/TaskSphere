import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env', override: false });

export default {
  schema: '../../packages/db/src/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
};
