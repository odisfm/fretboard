import * as z from "zod"

const MIN_LENGTH = 8

export const PasswordSchema = z.string()
    .min(8, {message: `Must be at least ${MIN_LENGTH} characters`})
    .regex(/[A-Z]/, {message: 'Must contain an uppercase letter'})
    .regex(/[a-z]/, {message: 'Must contain a lowercase letter'})
    .regex(/[0-9]/, {message: 'Must contain a number'})
    .regex(/[^A-Za-z0-9]/, {message: 'Must contain a special character'});
