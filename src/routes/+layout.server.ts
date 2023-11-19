import type { Actions, LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    return {
        user: locals.user
    };
}) satisfies LayoutServerLoad;
