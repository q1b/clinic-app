import { dev } from "$app/environment";
import { auth, googleAuth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from './$types';

export const actions: Actions = {
  logout: async (event) => {
    const session = await event.locals.auth.validate();
    if (!session) throw fail(401);
    await auth.invalidateSession(session.sessionId); // invalidate session
    event.locals.auth.setSession(null); // remove cookie
    event.locals.user = null
    event.locals.session = null
    throw redirect(303, '/'); // redirect to home page
  },
  login: async ({ locals, cookies }) => {
    const session = await locals.auth.validate();
    if (session) throw redirect(303, '/')
    const [url, state] = await googleAuth.getAuthorizationUrl();
    url.searchParams.set("prompt", 'consent');
    cookies.set('google_oauth_state', state, {
      httpOnly: true,
      secure: !dev,
      path: '/',
      maxAge: 60 * 60
    });
    throw redirect(308, url.toString())
  }
};