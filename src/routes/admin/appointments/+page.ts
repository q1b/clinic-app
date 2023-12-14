import { db } from '$lib/shared/db';
import type { PageLoad } from '../$types';

export const load = (async () => {
    const appointments = await db.query.appointment.findMany({
        with: {
            osteopath:{
                with: {user:true}
            },
            user:true
        }
    })
    return {
        users: {
            data: appointments
        }
    };
}) satisfies PageLoad;