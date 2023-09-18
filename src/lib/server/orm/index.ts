import * as schema from './schema';
import { pool } from "."
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const db = drizzle(pool, { schema });

await migrate(db, { migrationsFolder: "drizzle" });