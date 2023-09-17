import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { pool } from "../db"
import { migrate } from "drizzle-orm/node-postgres/migrator";

export const db = drizzle(pool, { schema });
await migrate(db, { migrationsFolder: "drizzle" });