import { auth } from '../../../lucia.js';
import { fail, redirect } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
  const session = await locals.auth.validate();
  if (!session) {
    throw redirect(302, '/'); // redirect to login page
  }
  await auth.invalidateSession(session.sessionId); // invalidate session
  locals.auth.setSession(null); // remove cookie
  throw redirect(302, '/'); // redirect to login page
}