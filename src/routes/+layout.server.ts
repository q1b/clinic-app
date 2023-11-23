import { auth } from '$lib/server/lucia';
import type { LayoutServerLoad } from './$types';

export const load = (async (event) => {
    event.locals.auth = auth.handleRequest(event);
    event.locals.session = await event.locals.auth.validate();

    return {
        isLogged: event.locals.session !== null,
        user: {
            id: event.locals.session?.user.id,
            image: event.locals.session?.user.image,
            name: event.locals.session?.user.name,
            email: event.locals.session?.user.email,
            isOsteopath: event.locals.session?.user.role === 'osteopath',            
        }
    };
}) satisfies LayoutServerLoad;