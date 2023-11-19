import { db } from '$lib/server/db';
import { and, eq, gte, isNull } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { appointment, osteopath } from '$lib/server/db/schema';
import groupBy from 'just-group-by';
import { Temporal } from '@js-temporal/polyfill';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	const osteopathId = event.params.id;

	const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
	try {
		const data = await db.query.osteopath.findFirst({
			where: eq(osteopath.id, osteopathId),
			with: {
				user: true,
				appointments: {
					where: and(isNull(appointment.userId), gte(appointment.date, t))
				}
			}
		});
		const bydates = groupBy(data?.appointments || [], (appointment) => appointment.date as string);
		if (data) return { by: { dates: bydates }, user: data.user };
	} catch (error) {
		throw fail(404);
	}
	throw redirect(307, '/');
};