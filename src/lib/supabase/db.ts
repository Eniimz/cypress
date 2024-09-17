    import { drizzle } from "drizzle-orm/postgres-js";
    import postgres from 'postgres';
    import * as dotenv from 'dotenv';
    import * as schema from '../../../migrations/schema';
    import { migrate } from "drizzle-orm/postgres-js/migrator";
    import exp from "constants";
    dotenv.config({ path: 'env' })

    if(!process.env.DATABASE_URL){
        console.log("No database url")
    }

    const client = postgres(process.env.DATABASE_URL as string, { max: 1 }) //client for postgres db
    const db = drizzle(client, { schema }) //doing this so we can use drizzle orm to interact with postgres database
    
    const migrateDb = async () => {
        try{
            console.log("Migrating client")
            await migrate(db, { migrationsFolder: "migrations" })
            console.log("Succeefully migrated")
        }catch(err){
            console.log("Error migrating client: ", err)
        }
    }

    migrateDb();

    export default db;  