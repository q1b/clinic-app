import { dev } from "$app/environment";
import { auth, googleAuth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from './$types';
import { Temporal } from "@js-temporal/polyfill";

export const actions: Actions = {
  dialog: async ({ request }) => {
    const formData = await request.formData();
    const [year,month,day] = formData.get('on')?.toString().split('-').map((a) => +a);
    const [hour,minute] = formData.get('start-at')?.toString().split(':').map((a) => +a);
    const duration = formData.get('duration');
    const startAt = new Temporal.PlainDateTime(year,month,day,hour,minute);
    // const endAt = new Temporal.Duration(0,0,0,0,0,duration);
    const endAt = startAt.add({
      minutes: +duration
    });
    console.log(startAt.toString(),endAt.toString())
  },
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