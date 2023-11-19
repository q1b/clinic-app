import { db } from '$lib/server/db';
import { Temporal } from '@js-temporal/polyfill';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async (event) => {
	const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
	// where: and(isNull(appointment.userId), gte(appointment.date,t))
	const osteopaths = await db.query.osteopath.findMany({
		with: {
			user: true,
			appointments: true
		}
	});
	return {
		osteopaths
	};
};

export const actions: Actions = {
	logout: async (event) => {
		const session = await event.locals.auth.validate();
		if (!session) throw fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.auth.setSession(null); // remove cookie
		event.locals.user = null;
		event.locals.session = null;
		throw redirect(303, '/'); // redirect to home page
	}
};
