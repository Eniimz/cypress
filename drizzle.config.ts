import { defineConfig } from "drizzle-kit";
import * as  dotenv from 'dotenv'

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/lib/supabase/schema.ts",
    out: "./migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL || '',
        port: 5432,
    },

})