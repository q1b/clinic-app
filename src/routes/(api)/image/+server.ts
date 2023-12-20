import type { RequestHandler } from '@sveltejs/kit';
import cloudinary from '$lib/server/cloudinary';
import { auth } from '$lib/server/lucia';

export const POST: RequestHandler = (async ({ request }) => {
	const { userId, url } = await request.json();
	try {
		await auth.updateUserAttributes(userId, {
			image: url
		});
		return new Response(JSON.stringify({ message: 'Image URL is Updated' }));
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Image URL is Failed', error: true }));
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const publicId = await request.json();
	await cloudinary.uploader.destroy(publicId.id as string);
	return new Response(JSON.stringify({ message: 'Thing deleted' }));
}) satisfies RequestHandler;
