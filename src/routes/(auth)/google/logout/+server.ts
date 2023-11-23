import { auth } from '$lib/server/lucia.js';
import { redirect } from '@sveltejs/kit';

export const prerender = false;

export const GET = async ({ locals }) => {
  const session = await locals.auth.validate();
  console.log("LOGOUT ENDPOINT")
  if (!session) {
    console.log("Already Logout")
    throw redirect(308, '/'); // redirect to login page
  }
  await auth.invalidateSession(session.sessionId); // invalidate session
  locals.auth.setSession(null); // remove cookie
  throw redirect(308, '/'); // redirect to login page
}