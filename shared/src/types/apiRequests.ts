import * as z from "zod"

export const LoginRequestSchema =  z.object({
    email: z.email(),
    password: z.string()
})

export type LoginRequestType = z.infer<typeof LoginRequestSchema>
