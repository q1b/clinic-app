import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema/index";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import type { Actions } from './$types';
import { auth } from "$lib/server/lucia";
import { LuciaError } from "lucia";

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
  default: async ({ cookies, params, request, locals }) => {
    const data = await request.formData();
    const userId = params.id;
    const name = data.get('name');
    const bio = data.get('bio');
    const email = data.get('email-address');
    const contact = data.get('contact-number');
    console.log("NAME", name);
    console.log("BIO", bio);
    console.log("EMAIL", email);
    console.log("CONTACT", contact);
    try {
      const res = await auth.updateUserAttributes(userId, {
        name: name?.toString(),
        email: email?.toString(),
        phone_number: contact?.toString(),
        bio: bio?.toString(),
      });
      locals.auth.invalidate()
      return { success: true, values: res };
    } catch (e) {
      if (e instanceof LuciaError && e.message === `AUTH_INVALID_USER_ID`) {
        return { message: 'invalid user id' }
      }
      // provided user attributes violates database rules (e.g. unique constraint)
      // or unexpected database errors
      return { message: 'unexpected database errors' }
    }
  },
} satisfies Actions;