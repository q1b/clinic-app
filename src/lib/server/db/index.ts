import * as schema from './schema';
import { drizzle } from "drizzle-orm/node-postgres";
import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { dev } from '$app/environment';

export const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

export const db = drizzle(pool, { schema });

if (dev) {
	const { migrate } = await import('drizzle-orm/node-postgres/migrator');
	await migrate(db, { migrationsFolder: "drizzle" })
}