import { db } from '$lib/shared/db';
import type { PageLoad } from '../$types';

export const load = (async () => {
    const users = db.query.user.findMany({
        with: {
            osteopath: true
        }
    })
    return {
        users: {
            data: users
        }
    };
}) satisfies PageLoad;