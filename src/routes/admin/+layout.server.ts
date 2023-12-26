import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
  const session = await event.locals.auth?.validate();
  if (session?.user.email === 'sukhpreetben10@gmail.com' || session?.user.email === 'peadevp@gmail.com')
    return { isAdmin: true }
  redirect(307, '/')
}) satisfies LayoutServerLoad;
