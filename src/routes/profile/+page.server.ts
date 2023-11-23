import { auth, getSession } from '$lib/server/lucia';
import type { Key } from 'lucia';
import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const session = await getSession(event);
	let keys:Key[] = [];
	const userId = session?.user_id;
	if (userId) keys = await auth.getAllUserKeys(userId);
	return { keys, user: session?.user };
}) satisfies PageServerLoad;
