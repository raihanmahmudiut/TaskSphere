import * as postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../../../.env') });

async function check() {
  // @ts-expect-error - postgres.default may not exist in some versions
  const sql = (postgres.default || postgres)(process.env.DATABASE_URL!);
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('Tables in public schema:', tables);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await sql.end();
  }
}

check();
