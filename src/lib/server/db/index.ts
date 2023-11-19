import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';
import { DATABASE_URL, DATABASE_AUTH_TOKEN } from '$env/static/private';
import { createClient } from "@libsql/client";

export const client = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });

export const db = drizzle(client, { schema });

// import { migrate } from "drizzle-orm/libsql/migrator";
// try {
//   console.log("RUNNING MIGRATIONS")
//   const res = await migrate(db, {
//     migrationsFolder: "drizzle/migrations",
//   });
//   console.log(res)
// } catch (error) {
//   console.log("Unable to migrate")
// }