import type { Actions, PageServerLoad } from "./$types"
import { superValidate } from "sveltekit-superforms/server"
import { formSchema } from "./schema"
import { fail } from "@sveltejs/kit"

export const load:PageServerLoad = () => {
  return {
    form: superValidate(formSchema)
  }
}

export const actions:Actions = {
  default: async (event) => {
    const form = await superValidate(event,formSchema);
    if(!form.valid) {
      return fail(400,{
        form
      })
    }
    console.log(form.data)
    return {
      form
    }
  }
}