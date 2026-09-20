import {createHono} from "../helpers/createHono";
import {LoginRequestSchema, RegisterRequestSchema} from "@fretboard/shared/types/apiRequests";
import {db} from "@fretboard/shared";
import {deleteCookie, setCookie} from "hono/cookie";
import {checkPassword, hashPassword} from "../helpers/password";
import * as z from "zod";
import {PasswordSchema} from "../types/password";
import type {RegistrationFailure} from "@fretboard/shared/types/apiResponses";
import {Prisma} from "@fretboard/shared/prisma/client";
import {authCookieOptions} from "../utils/cookieOptions";
import {needsAuth} from "../middleware/needsAuth";
import {SESSION_EXPIRY} from "../consts";

export const authRouter = createHono()

authRouter.post("/login", async (c) => {
    if (c.get("user")) {
        return c.json({email: c.get("user")!.email}, 200)
    }
    let body
    try {
        body = LoginRequestSchema.parse(await c.req.json())
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    const userRecord = await db.user.findUnique({where: {email: body.email}})
    if (!userRecord) {
        return c.json({error: "Invalid credentials"}, 401)
    }

    const passwordMatch = await checkPassword(body.password, userRecord.password)
    if (!passwordMatch) {
        return c.json({error: "Invalid credentials"}, 401)
    }

    const sessionRecord = await db.session.create({
        data: {
            userId: userRecord.id,
            expiry: new Date(Date.now() + SESSION_EXPIRY)
        }
    })
    setCookie(c, "sessionId", sessionRecord.id, authCookieOptions)
    return c.json({email: body.email}, 200)
})

authRouter.post("/register", async (c) => {
    if (c.get("user")) {
        return c.json({email: c.get("user")!.email}, 200)
    }
    let body
    try {
        body = RegisterRequestSchema.parse(await c.req.json())
    } catch (e) {
        console.error(e)
        return c.json({error: "Malformed input"}, 400)
    }
    try {
        PasswordSchema.parse(body.password)
    } catch (e) {
        let passwordConstraints: string[]
        if (e instanceof z.ZodError) {
            passwordConstraints = e.issues.map(i => i.message)
            return c.json({
                error: {
                    message: "Password does not meet requirements",
                    passwordConstraints
                }
            } satisfies RegistrationFailure, 400)
        } else {
            // shouldn't happen
            console.error(e)
            return c.json({error: "Internal server error"}, 500)
        }
    }
    const passwordHash = await hashPassword(body.password)
    try {
        const userRecord = await db.user.create({
            data: {
                email: body.email,
                password: passwordHash,
                prefs: body.prefs
            }
        })
        const sessionRecord = await db.session.create({
            data: {
                userId: userRecord.id,
                expiry: new Date(Date.now() + SESSION_EXPIRY)
            }
        })

        setCookie(c, "sessionId", sessionRecord.id, authCookieOptions)
        return c.json({email: body.email}, 200)

    } catch (e) {
        console.error(e)
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return c.json({
                error: {
                    message: "This email address already exists",
                    emailTaken: true
                }
            } satisfies RegistrationFailure, 409)

        } else {
            return c.json({error: "Internal server error"}, 500)
        }
    }
})

authRouter.post("/logout", needsAuth, async (c) => {
    await db.session.delete({where: {id: c.get("sessionId")!}})
    deleteCookie(c, "sessionId")
    return c.json({}, 200)
})

authRouter.get("/me", needsAuth, async (c) => {
    return c.json({email: c.get("user")!.email}, 200)
})
