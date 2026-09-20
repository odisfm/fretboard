import * as z from "zod"
import {UserPrefSchema} from "./userPrefs";

export const LoginRequestSchema =  z.object({
    email: z.email(),
    password: z.string()
})

export type LoginRequestType = z.infer<typeof LoginRequestSchema>

export const RegisterRequestSchema = LoginRequestSchema.extend({
    prefs: UserPrefSchema
})

export type RegisterRequestType = z.infer<typeof RegisterRequestSchema>

