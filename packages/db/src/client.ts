import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index';

export const createDb = (url: string) => {
  const queryClient = postgres(url);
  return drizzle(queryClient, { schema });
};

export type DbClient = ReturnType<typeof createDb>;
