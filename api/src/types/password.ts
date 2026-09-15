import * as z from "zod"

const MIN_LENGTH = 8

export const PasswordSchema = z.string()
    .min(8, {message: `Password must be at least ${MIN_LENGTH} characters`})
    .regex(/[A-Z]/, {message: 'Contain at least one uppercase letter'})
    .regex(/[a-z]/, {message: 'Contain at least one lowercase letter'})
    .regex(/[0-9]/, {message: 'Contain at least one number'})
    .regex(/[^A-Za-z0-9]/, {message: 'Contain at least one special character'});
