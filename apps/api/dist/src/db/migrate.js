"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_js_1 = require("drizzle-orm/postgres-js");
const migrator_1 = require("drizzle-orm/postgres-js/migrator");
const postgres_1 = require("postgres");
const dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
async function runMigrations() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }
    const migrationClient = (0, postgres_1.default)(process.env.DATABASE_URL, { max: 1 });
    const db = (0, postgres_js_1.drizzle)(migrationClient);
    console.log('⏳ Running migrations...');
    await (0, migrator_1.migrate)(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed.');
    await migrationClient.end();
    console.log('👋 Migration client closed.');
    process.exit(0);
}
runMigrations().catch((err) => {
    console.error('❌ Migration failed:');
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map