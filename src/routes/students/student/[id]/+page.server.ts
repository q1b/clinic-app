import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';
import { isValidPhoneNumber } from "libphonenumber-js";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
  const userId = event.params.id;
  const data = await db.query.user.findFirst({
    where: eq(user.id, userId)
  })
  return {
    student: data ?? null
  }
};


export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const bio = data.get('bio');
    const email = data.get('email-address');
    const contact = data.get('contact-number');
    return { success: true };
  },
} satisfies Actions;