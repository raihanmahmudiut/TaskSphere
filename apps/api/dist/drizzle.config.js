"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({ path: '.env.local' });
exports.default = {
    schema: './src/db/index.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
    verbose: true,
    strict: true,
};
//# sourceMappingURL=drizzle.config.js.map