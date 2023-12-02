import { db } from '$lib/shared/db';
import { Temporal } from '@js-temporal/polyfill';
import { and, asc, gte, isNotNull, eq } from 'drizzle-orm';
import { appointment } from '$lib/shared/db/schema';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const osteopathId = params.id;
	const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
	const appointments = db.query.appointment
		.findMany({
			with: {
				user: true
			},
			where: and(
				isNotNull(appointment.userId),
				gte(appointment.date, t),
				eq(appointment.osteopathId, osteopathId)
			),
			orderBy: asc(appointment.date)
		})
		.execute();
	return {
		streamed: {
			data: appointments
		}
	};
};
