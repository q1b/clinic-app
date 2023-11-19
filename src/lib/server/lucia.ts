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
import { createId } from '@paralleldrive/cuid2';
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
export const twilioAuth = remember('twilio',() => twilio(auth, {
  sid: TWILIO_SID,
  authToken: TWILIO_TOKEN,
  verifySid: TWILIO_VERIFY_SID,
}));

declare global {
  // eslint-disable-next-line no-var
  var twilio: TwilioClient.Twilio | undefined;
}

function twilio(auth:Auth, options: {
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
    async sendVarificationCode(phoneNumber: string) {
      return await twilio.verify.v2.services(options.verifySid).verifications.create({
          to: phoneNumber,
          channel: 'sms'
      })
    },
    async validateCode(phoneNumber:string, code:string) {
      let verified = false;
      const verification_check = await twilio.verify.v2.services(options.verifySid).verificationChecks.create({ to: phoneNumber, code: code });
      if (verification_check.status === "approved") verified = true;
      const id = createId();
      const createUser = async ({attributes}:{attributes:Omit<User,'id'| 'userId' | 'phone_number' | 'phone_number_verified'>}) => {
        return await auth.createUser({
          attributes: {
            id,
            phone_number: phoneNumber,
            phone_number_verified: verified,
            ...attributes,
          },
          key: {
            password: '',
            providerId: 'phone',
            providerUserId: phoneNumber,
          },
          userId: id,
        })
      };
      const getExistingUser = async () => {
        try {
          const res = await auth.getKey('phone', phoneNumber)
          return await auth.getUser(res?.userId)
        } catch (error) {
          return null
        }
      }
      return {
        getExistingUser,
        createUser,
        verified
      }    
    },
  }
}

export type Auth = typeof auth;
