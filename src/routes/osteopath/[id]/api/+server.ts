import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getGoogleTokens } from '$lib/server/kv';
import calendarService from '$lib/server/calendar';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	console.log(body);
	const tokens = await getGoogleTokens(body.osteopathUserId)
	console.log(tokens)
	if(tokens?.access_token && tokens.refersh_token) {
		const calendar = calendarService({
			userId: body.osteopathUserId,
			access_token: tokens.access_token,
			refresh_token: tokens.refersh_token,
		})
		const calendars = await calendar.getCalendar()
		console.log(calendars);
	}
	return json(body);
};