import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { dev } from "$app/environment";
import { google } from "@lucia-auth/oauth/providers"
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE } from "$env/static/private";
import upstashClient from "./kv";
import { upstash } from "@lucia-auth/adapter-session-redis";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "./db";

// default values
export const auth = lucia({
  env: dev ? "DEV" : "PROD",
  middleware: sveltekit(),
  adapter: {
    user: pg(pool, {
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
    // console.log("From Session Attributes Session", session)
    return session
  },
  getUserAttributes(user) {
    // console.log("From User Attributes ", user)
    return user
  },
  // ...
});

export const googleAuth = google(auth, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  accessType: 'offline',
  redirectUri: GOOGLE_REDIRECT_URI,
  scope: ['openid', 'email', 'profile', GOOGLE_SCOPE],
});

// export const getSession = async (event) => {
// 	const authRequest = auth.handleRequest(event);
// 	const session = await authRequest.validate();
// 	return session
// }

export type Auth = typeof auth;
