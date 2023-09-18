import pg from 'pg';
import { DATABASE_URL } from '$env/static/private';
import { dev } from "$app/environment";


declare global {
	// eslint-disable-next-line no-var
	var __pg_pool: import('pg').Pool;
}

const pool = new pg.Pool({
  connectionString: DATABASE_URL
});

if (dev) {
	globalThis.__pg_pool = pool;
}

export default pool;

// export const client = new Client(DATABASE_URL);

// (async () => {
//   await pool.connect();
//   try {
//     const results = await pool.query("SELECT NOW()");
//     console.log(results);
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     pool.end();
//   }
// })();