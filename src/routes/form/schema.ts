import { z  } from "zod"

export const formSchema = z.object({
  username: z.string().min(2).max(15)
})

export type FormSchema = typeof formSchema