import { dev } from "$app/environment";
import { auth, googleAuth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from './$types';
import { Temporal } from "@js-temporal/polyfill";
import { appointment } from "$lib/server/db/schema";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async () => {
  const osteopaths = db.query.osteopath.findMany({ with: { user: true } })
  const appointments = db.query.appointment.findMany({ with: { osteopath: { with: {user:true} } } })
  return { appointments, osteopaths }
};

export const actions: Actions = {
  dialog: async ({ request, locals }) => {
    console.log("Inisiated the Process")
    const formData = await request.formData();
    const userId = locals.user?.id;
    const [year, month, day] = formData.get('on')?.toString().split('-').map((a) => +a);
    const [hour, minute] = formData.get('start-at')?.toString().split(':').map((a) => +a);
    const duration = (formData.get('duration'))?.toString() ?? '30';
    const date = new Temporal.PlainDate(year, month, day);
    const startAt = new Temporal.PlainTime(hour, minute);
    // const endAt = new Temporal.Duration(0,0,0,0,0,duration);
    const endAt = startAt.add({
      minutes: +duration
    });
    if (userId) {
      console.log("User Id Valid", userId)
      const data = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, userId),
        with: {
          osteopath: true
        }
      })
      const osteopathId = data?.osteopath?.id
      if (osteopathId) {
        console.log("Osteopath Id Valid",osteopathId)
        const res = await db.insert(appointment).values({
          osteopathId,
          duration: duration as '30' | '45' | '60',
          startAt: startAt.toString(),
          date: date.toString(),
        }).returning()
        console.log("RESPONSE ", JSON.stringify(res, null, 2))
      } else {
        console.log("DIALOG ACTION FAILED PATH:'/' \n Not Valid OsteopathId")
      }
    }else {
      console.log("DIALOG ACTION FAILED PATH:'/' ")
    }
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