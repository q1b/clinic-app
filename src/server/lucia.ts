import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
// import { upstash } from "@lucia-auth/adapter-session-redis";
import { google } from "@lucia-auth/oauth/providers"
import * as env from "$env/static/private";
// import upstashClient from "./kv";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "./db";

// default values
export const auth = lucia({
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit(),
	adapter: pg(pool, {
		user: "auth_user",
		key: "user_key",
		session: "user_session"
	}),
	getSessionAttributes: (session) => {
		console.log(session)
		return session
	},
	getUserAttributes(user) {
		console.log(user)
		return user
	},
	// ...
});
export const googleAuth = google(auth, {
	clientId: env.GOOGLE_CLIENT_ID,
	clientSecret: env.GOOGLE_CLIENT_SECRET,
	accessType: 'offline',
	redirectUri: env.GOOGLE_REDIRECT_URI,
	scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/calendar'],
});

// export const getSession = async (event) => {
// 	const authRequest = auth.handleRequest(event);
// 	const session = await authRequest.validate();
// 	return session
// }

export type Auth = typeof auth;