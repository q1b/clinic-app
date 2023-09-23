import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/lucia.js';

export const GET = async ({ cookies, locals }) => {
	const session = await locals.auth.validate();
	if (session) {
		return new Response(null, {
			status: 308,
			headers: {
				Location: '/'
			}
		});
	}
	const [url, state] = await googleAuth.getAuthorizationUrl();
	cookies.set('google_oauth_state', state, {
		httpOnly: true,
		secure: !dev,
		path: '/',
		maxAge: 60 * 60
	});
	return new Response(null, {
		status: 308,
		headers: {
			Location: url.toString()
		}
	});
};