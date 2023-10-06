import { twilioAuth } from "$lib/server/lucia";
import type { Actions, PageServerLoad } from "./$types"
import { superValidate } from "sveltekit-superforms/server"
import { verifySchema, infoSchema } from "./schema"
import { fail } from "@sveltejs/kit"
import kv from "$lib/server/kv"

export const load:PageServerLoad = () => {
  return {
    infoForm:superValidate(infoSchema),
    verifyForm: superValidate(verifySchema)
  }
}

export const actions:Actions = {
  info: async (event) => {
    const infoForm = await superValidate(event,infoSchema);

    if(!infoForm.valid) {
      return fail(400,{
        infoForm
      })
    }
    let phone_number = infoForm.data.phone_number;
    if(!phone_number.includes('+91'))
      phone_number = '+91' + phone_number;
    
    const res = await twilioAuth.sendVarificationCode(phone_number)
    
    console.log(res);

    event.cookies.set('phone_number',phone_number);
    event.cookies.set('full_name',infoForm.data.full_name);
    return {
      infoForm,
    }
  },
  verify: async (event) => {
    const phone_number = event.cookies.get('phone_number');
    const full_name = event.cookies.get('full_name');

    const verifyForm = await superValidate(event,verifySchema);

    if(!verifyForm.valid) {
      return fail(400,{
        verifyForm
      })
    }
    if(!phone_number) return fail(400,{verifyForm});
    if(!full_name) return fail(400,{verifyForm});
    const { createUser, getExistingUser, verified } = await twilioAuth.validateCode(phone_number,verifyForm.data.code)
    const existingUser = await getExistingUser();
    if(existingUser === null) {
      const user = await createUser({
        attributes: {
          name: full_name,
          email: null,
          image: null,
          bio: null
        }
      });
    }
    return {
      verified,
      verifyForm
    }
  }
}