import { dev } from "$app/environment";
import { auth, googleAuth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from './$types';
import { db } from "$lib/server/orm/index";
import { users } from "$lib/server/orm/schema";

export const load: PageServerLoad = async ({ params, locals }) => {
  const session = await locals.auth.validate();
  const user = db.select().from(users)
  return {
    sessionId: session?.id,
    user
  };
};

export const actions: Actions = {
  logout: async ({ locals }) => {
    const session = await locals.auth.validate();
    if (!session) throw fail(401);
    await auth.invalidateSession(session.sessionId); // invalidate session
    locals.auth.setSession(null); // remove cookie
    throw redirect(303, '/'); // redirect to home page
  },
  login: async ({ locals, cookies }) => {
    const session = await locals.auth.validate();
    if (session) throw redirect(303, '/')
    const [url, state] = await googleAuth.getAuthorizationUrl();
    cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: !dev,
      path: '/',
      maxAge: 60 * 60
    });
    throw redirect(308, url.toString())
  }
};