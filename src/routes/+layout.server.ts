import { auth } from '$lib/server/lucia';
import { db } from '$lib/shared/db';
import { eq } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { osteopath } from '$lib/shared/db/schema';

export const load = (async (event) => {
	event.locals.auth = auth.handleRequest(event);
	event.locals.session = await event.locals.auth.validate();
	if (event.locals.session?.user.role === 'osteopath') {
		const data = await db.query.osteopath.findFirst({
			where: eq(osteopath.userId, event.locals.session.user_id)
		});
		event.locals.osteopathID = data?.id ? data.id : null;
	}
	return {
		isLogged: event.locals.session !== null,
		user: {
			id: event.locals.session?.user.id,
			image: event.locals.session?.user.image,
			name: event.locals.session?.user.name,
			email: event.locals.session?.user.email,
			isOsteopath: event.locals.session?.user.role === 'osteopath',
			osteopathID: event.locals.osteopathID
		}
	};
}) satisfies LayoutServerLoad;
