import * as schema from './schema';
import { drizzle } from 'drizzle-orm/libsql';
import {
	PUBLIC_DATABASE_URL as DATABASE_URL,
	PUBLIC_DATABASE_AUTH_TOKEN as DATABASE_AUTH_TOKEN
} from '$env/static/public';
import { remember } from '@epic-web/remember';
// import { browser } from '$app/environment';
// import type { Config, Client } from '@libsql/client';
import { createClient } from '@libsql/client/web';

// let createClient:
// 	| ((config: Config) => Client)
// 	| ((arg0: { url: string; authToken: string }) => any);

// if (browser) {
// 	createClient = func;
// } else {
// 	const { createClient: func } = await import('@libsql/client');
// 	createClient = func;
// }

export const client = remember('libsql', () =>
	createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN })
);
export const db = drizzle(client, { schema });
