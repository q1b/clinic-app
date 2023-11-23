import { dev } from '$app/environment';
import { googleAuth } from '$lib/server/lucia.js';

export const GET = async ({ cookies, locals, url: { searchParams } }) => {
	const connect = searchParams.get('connect');
	const sessionUserId = locals.session?.user.id;
	if (connect === null) {
		if (sessionUserId) {
			return new Response(null, {
				status: 308,
				headers: {
					Location: '/'
				}
			});
		}
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
