import type { Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

export const actions: Actions = {
	logout: async (event) => {
        const lucia = auth.handleRequest(event);
        const session = await lucia.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		event.locals.session = null
		lucia.setSession(null)
		throw redirect(303, '/'); // redirect to home page
	}
};
