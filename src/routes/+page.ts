import { db } from '$lib/shared/db';
import { Temporal } from '@js-temporal/polyfill';
import { and, asc, gte, isNull } from 'drizzle-orm';
import { appointment } from '$lib/shared/db/schema';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ setHeaders }) => {
	const today = Temporal.Now.plainDateISO().toLocaleString('en', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
	const [month, day, year] = today.split('/');
	const t = `${year}-${month}-${day}`;
	const osteopaths = db.query.osteopath.findMany({
		with: {
			user: true,
			appointments: {
				where: and(isNull(appointment.userId), gte(appointment.date,t)),
				orderBy: asc(appointment.date)
			},
		},
	}).execute();
	setHeaders({
		'cache-control': 'public, max-age=604800'
	})
	return {
		streamed: {
			data: osteopaths
		}
	};
};
