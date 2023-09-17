// import { db } from '$lib/server/db/index';
// import { users } from '$lib/server/db/schema/index';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  // const session = await locals.auth.validate();
  // console.log("Session", session)
  return {
    // users: await db.select().from(users)
  };
};