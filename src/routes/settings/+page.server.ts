import { auth } from '$lib/server/lucia';
import { db } from '$lib/shared/db';
import { user } from '$lib/shared/db/schema';
import type { Key } from 'lucia';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async (event) => {
	await event.parent();
	const session = event.locals.session;
	let keys: Key[] = [];
	const userId = session?.user_id;
	if (userId) keys = await auth.getAllUserKeys(userId);
	return { keys, user: session?.user };
}) satisfies PageServerLoad;

export const actions: Actions = {
	profile: async (event) => {
		const formData = await event.request.formData();
		const fullName = formData.get('full-name');
		const bio = formData.get('bio');
		const username = formData.get('username');
		const userId = formData.get('user_id');
		if (userId) {
			// update username, fullName, bio
			console.log('Updating user');
			await db
				.update(user)
				.set({
					...(username && { username: username?.toString() }),
					...(fullName && { name: fullName?.toString() }),
					...(bio && { bio: bio?.toString() })
				})
				.where(eq(user.id, userId.toString()));
			console.log('Updating data successfully');
		}
	},
	personal: async (event) => {
		const formData = await event.request.formData();
		const state = formData.get('state');
		const userId = formData.get('user_id');
		console.log('Running');
		if (userId) {
			console.log('Updating state');
			await db
				.update(user)
				.set({
					...(state && { state: state?.toString() })
				})
				.where(eq(user.id, userId.toString()));
			console.log('Updated data successfully');
		}
	}
};
