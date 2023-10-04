import { sendVerificationCode, verifyPhoneNumber } from "$lib/server/sms/verifyNumber";
import type { Actions } from "./$types";

export const actions: Actions = {
  sendCode: async (event) => {
    const data = await event.request.formData()
    const phone_number = data.get('phone_number')
    if(phone_number){
      await sendVerificationCode(phone_number.toString())
    }
    return { sended: true }
  },
  verifyCode: async (event) => {
    const data = await event.request.formData()
    const verify_code = data.get('verify_code')
    const phone_number = data.get('phone_number')
    if(verify_code && phone_number) {
      const verified = await verifyPhoneNumber(phone_number.toString(),verify_code.toString())
      return { verified }
    }
    return { verified: false, failed: true }
  },
};