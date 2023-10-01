import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { google } from "@lucia-auth/oauth/providers";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE } from "$env/static/private";
import upstashClient from "./kv";
import { upstash } from "@lucia-auth/adapter-session-redis";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { client } from "$lib/server/db";

// default values
export const auth = lucia({
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  adapter: {
    user: libsql(client, {
      session: null,
      user: 'user',
      key: 'key'
    }),
    session: upstash(upstashClient, {
      userSessions: "user_session",
      session: "session"
    })
  },
  getSessionAttributes: (session) => {
    return session
  },
  getUserAttributes(user) {
    return user
  },
  // ...
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  accessType: 'offline',
  redirectUri: dev ? 'http://localhost:3000/google/callback' : GOOGLE_REDIRECT_URI,
  scope: ['openid', 'email', 'profile', GOOGLE_SCOPE],
});

// export const getSession = async (event) => {
// 	const authRequest = auth.handleRequest(event);
// 	const session = await authRequest.validate();
// 	return session
// }

export type Auth = typeof auth;
