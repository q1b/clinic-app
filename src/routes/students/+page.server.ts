import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";

export const load = async () => {
  const data = await db.select().from(user)
  return {
    users: data
  }
};
