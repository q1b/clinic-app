import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	login: async (event) => {
		const form = await event.request.formData();
		const phoneNumber = form.get('phone-number')!;
		const password = form.get('password')!;
		const isRedirected = form.get('redirect')!;
		try {
			// find user by key
			// and validate password
			const key = await auth.useKey('sms', `+91${phoneNumber.toString()}`, password.toString());
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			auth.handleRequest(event).setSession(session) // set session cookie
		} catch (e) {
			console.log(e)
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				// user does not exist
				// or invalid password
				return fail(400, {
					message: 'Incorrect username or password',
					validated: false,
				});
			}
			return fail(500, {
				message: 'An unknown error occurred',
				validated: false,
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		if(isRedirected === 'true') redirect(302, "/");
		return {
			validated: true
		}
	}
};
