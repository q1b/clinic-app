import { db } from '$lib/shared/db';
import { and, asc, eq, gte } from 'drizzle-orm';
import type { PageLoad } from './$types';
import { appointment } from '$lib/shared/db/schema';
import groupBy from 'just-group-by';
import { Temporal } from '@js-temporal/polyfill';

export const load = (async (event) => {
    const data = await event.parent();
    const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
    if(data.user.osteopathID) {
        const appointments = await db.query.appointment.findMany({
            where: and(eq(appointment.osteopathId, data.user.osteopathID),gte(appointment.date, t)),
            orderBy: asc(appointment.date),
            with: {
                user: true
            }
        })
        const groupByDate = groupBy(appointments,(appointment) => appointment.date || '0000-00-00')
        return { appointmentsByDate: groupByDate }
    } else {
        
    }
    return {};
}) satisfies PageLoad;