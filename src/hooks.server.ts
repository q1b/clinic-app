import { auth } from '$lib/server/lucia';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // we can pass `event` because we used the SvelteKit middleware
  const lucia = auth.handleRequest(event);
  event.locals.auth = lucia;
  event.locals.session = await lucia.validate();
  event.locals.user = event.locals.session?.user ?? null;
  return await resolve(event);
};
