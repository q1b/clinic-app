import { lucia, type User } from "lucia";
import { sveltekit } from "lucia/middleware";
import { google } from "@lucia-auth/oauth/providers";
import { libsql } from "@lucia-auth/adapter-sqlite";
import { upstash } from "@lucia-auth/adapter-session-redis";
import { dev } from "$app/environment";
import TwilioClient from "twilio";
import { remember } from "@epic-web/remember"
import { client } from "$lib/server/db";
import upstashClient from "./kv";
import { TWILIO_SID, TWILIO_TOKEN, TWILIO_VERIFY_SID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_SCOPE } from "$env/static/private";

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

export const twilioClient = remember('twilio',() => twilio({
  sid: TWILIO_SID,
  authToken: TWILIO_TOKEN,
  verifySid: TWILIO_VERIFY_SID,
}));

declare global {
  // eslint-disable-next-line no-var
  var twilio: TwilioClient.Twilio | undefined;
}

function twilio(options: {
  sid: string,
  authToken: string,
  verifySid: string
}) {
  // const twilio = TwilioClient(options.sid, options.authToken)
  const twilio = globalThis.twilio || TwilioClient(TWILIO_SID, TWILIO_TOKEN)

  if (dev) {
    globalThis.twilio = twilio;
  }
  
  return {
    async sendVarificationCode(phoneNumber: string, password: string) {
      const res = await twilio.verify.v2.services(options.verifySid).verifications.create({
          to: phoneNumber,
          channel: 'sms',
      });
      return {
        status: res.status,
        to: res.to
      }
    },
    async validateCode(phoneNumber:string, code:string) {
      let verified = false;
      const verification_check = await twilio.verify.v2.services(options.verifySid).verificationChecks.create({ to: phoneNumber, code: code });
      if (verification_check.status === "approved") verified = true;
      return {
        verified,
        to: verification_check.to
      }    
    },
  }
}

export type Auth = typeof auth;
