import { dev } from "$app/environment";
import { TWILIO_SID, TWILIO_TOKEN, TWILIO_VERIFY_SID } from "$env/static/private";
import TwilioClient from "twilio";

declare global {
  // eslint-disable-next-line no-var
  var twilio: TwilioClient.Twilio | undefined;
}

export const twilio = globalThis.twilio || TwilioClient(TWILIO_SID, TWILIO_TOKEN)

if (dev) {
  globalThis.twilio = twilio;
}

// const sendSMS = async (phoneNumber: string, body: string, sender: string) => {
//   const response = await twilio.messages.create({
//     body: body,
//     messagingServiceSid: TWILIO_MESSAGING_SID,
//     to: phoneNumber,
//     from: sender ? sender : TWILIO_PHONE_NUMBER,
//   });

//   return response;
// };

export const sendVerificationCode = async (phoneNumber: string) => {
  if (TWILIO_VERIFY_SID) {
    await twilio.verify.v2.services(TWILIO_VERIFY_SID).verifications.create({
      to: phoneNumber,
      channel: 'sms'
    })
  }
};

const verifyNumber = async (phoneNumber: string, code: string) => {
  if (TWILIO_VERIFY_SID) {
    try {
      const verification_check = await twilio.verify.v2.services(TWILIO_VERIFY_SID).verificationChecks.create({ to: phoneNumber, code: code });
      return verification_check.status;
    } catch (e) {
      return "failed";
    }
  }
};

export const verifyPhoneNumber = async (
  phoneNumber: string,
  code: string
) => {
  const verificationStatus = await verifyNumber(phoneNumber, code);
  if (verificationStatus === "approved") {
    return true;
  }
  return false;
};