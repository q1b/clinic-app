import TwilioClient from "twilio";
import {TWILIO_SID, TWILIO_TOKEN, TWILIO_VERIFY_SID,} from "$env/static/private"
import { dev } from "$app/environment";

export const smsClient = twilio({
  sid: TWILIO_SID,
  authToken: TWILIO_TOKEN,
  verifySid: TWILIO_VERIFY_SID,
})

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
    async sendVarificationCode(phoneNumber: string) {
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
