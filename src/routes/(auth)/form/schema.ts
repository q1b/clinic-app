import { string, z  } from "zod"
// import { isValidNumberForRegion } from "libphonenumber-js"

// const phone_number_schema = z.custom<string>((val) => {
//   return typeof val === "string" && isValidNumberForRegion(val,'IN')
// });

export const infoSchema = z.object({
  full_name: z.string().min(3),
  phone_number: z.string().min(10, {message: '10 digit phone number'}).max(10,{message: '10 digit phone number'})
});

// export const infoSchema = z.object({
//   full_name: z.string().min(3),
//   phone_number: phone_number_schema.transform(v => {
//     if(v.includes('+91'))
//       return v
//     else
//       return '+91' + v
//   }),
// });

export const verifySchema = z.object({
  code: string().min(6),
});

export type InfoFormSchema = typeof infoSchema;
export type VerifyFormSchema = typeof verifySchema;