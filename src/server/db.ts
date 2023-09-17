import { DATABASE_URL } from '$env/static/private';
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: DATABASE_URL
});

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

export default pool